-- Community Platform — initial schema (Phase 1)
-- Run in Supabase SQL editor or via supabase db push

-- Profiles
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  full_name    text not null,
  headline     text,
  bio          text,
  avatar_url   text,
  location     text,
  timezone     text,
  website_url  text,
  linkedin_url text,

  discipline   text not null,
  seniority    text,
  work_type    text[] default '{}',
  availability text default 'open',
  skills       text[] default '{}',
  tools        text[] default '{}',
  industries   text[] default '{}',
  looking_for  text,

  role         text not null default 'member' check (role in ('member', 'admin')),

  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(full_name, '') || ' ' ||
      coalesce(headline, '') || ' ' ||
      coalesce(bio, '') || ' ' ||
      coalesce(array_to_string(skills, ' '), '') || ' ' ||
      coalesce(array_to_string(tools, ' '), '') || ' ' ||
      coalesce(array_to_string(industries, ' '), '')
    )
  ) stored,

  is_featured  boolean default false,
  member_since timestamptz default now(),
  updated_at   timestamptz default now()
);

create index profiles_search_idx on public.profiles using gin(search_vector);
create index profiles_discipline_idx on public.profiles(discipline);
create index profiles_availability_idx on public.profiles(availability);
create index profiles_skills_idx on public.profiles using gin(skills);
create index profiles_tools_idx on public.profiles using gin(tools);

-- Applications (reviewed_by references profiles — created after profiles table exists)
create table public.applications (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  full_name    text not null,
  linkedin_url text,
  website_url  text,
  discipline   text not null,
  headline     text not null,
  motivation   text not null,
  referral     text,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'invited', 'completed')),
  reviewed_by  uuid references public.profiles(id),
  reviewed_at  timestamptz,
  invite_token text unique,
  invite_sent_at timestamptz,
  invite_expires_at timestamptz,
  created_at   timestamptz default now()
);

create index applications_status_idx on public.applications(status);
create index applications_invite_token_idx on public.applications(invite_token);

-- Opportunities
create table public.opportunities (
  id             uuid primary key default gen_random_uuid(),
  posted_by      uuid references public.profiles(id) on delete cascade,
  title          text not null,
  type           text not null,
  description    text not null,
  skills_needed  text[] default '{}',
  location_type  text,
  location       text,
  compensation   text,
  engagement     text,
  deadline       date,
  is_active      boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.opportunities enable row level security;

-- Profiles: members see directory; users can create/update own row
create policy "Members can read all profiles"
  on public.profiles for select
  using (auth.uid() in (select id from public.profiles));

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Members can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Applications: public submit pending only; no client reads (admin uses service role)
create policy "Public can submit applications"
  on public.applications for insert
  with check (coalesce(status, 'pending') = 'pending');

-- Opportunities
create policy "Members can read opportunities"
  on public.opportunities for select
  using (auth.uid() in (select id from public.profiles));

create policy "Members can insert opportunities"
  on public.opportunities for insert
  with check (auth.uid() = posted_by);

create policy "Members can update own opportunities"
  on public.opportunities for update
  using (auth.uid() = posted_by);
