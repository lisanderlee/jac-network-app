-- Fix RLS: "auth.uid() in (select id from profiles)" re-scans profiles under RLS and can
-- recurse or return no rows. Use SECURITY DEFINER helper so membership check bypasses RLS.

create or replace function public.is_profile_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
  );
$$;

revoke all on function public.is_profile_member() from public;
grant execute on function public.is_profile_member() to authenticated;
grant execute on function public.is_profile_member() to anon;
grant execute on function public.is_profile_member() to service_role;

drop policy if exists "Members can read all profiles" on public.profiles;
create policy "Members can read all profiles"
  on public.profiles for select
  using (public.is_profile_member());

drop policy if exists "Members can read opportunities" on public.opportunities;
create policy "Members can read opportunities"
  on public.opportunities for select
  using (public.is_profile_member());
