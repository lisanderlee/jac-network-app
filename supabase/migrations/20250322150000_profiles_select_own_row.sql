-- Allow any authenticated user to SELECT their own profile row (if it exists).
-- Without this, the login check relied on "no visible rows" when is_profile_member()
-- is false; being explicit avoids edge cases and documents intent.

create policy "Authenticated users can read own profile row"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);
