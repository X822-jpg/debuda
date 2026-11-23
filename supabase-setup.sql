-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Before the last statement, log in to Debuda once with each owner GitHub account so they exist in auth.users.

create table if not exists public.admins (id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('say','unlock','xmas')),
  payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint payload_small check (length(payload::text) < 600));
create table if not exists public.bans (
  key text primary key check (length(key) between 3 and 80),
  created_at timestamptz not null default now());

alter table public.admins enable row level security;
alter table public.site_events enable row level security;
alter table public.bans enable row level security;

drop policy if exists "admin reads self" on public.admins;
create policy "admin reads self" on public.admins for select to authenticated using (id = auth.uid());
drop policy if exists "everyone reads events" on public.site_events;
create policy "everyone reads events" on public.site_events for select to anon, authenticated using (true);
drop policy if exists "admins send events" on public.site_events;
create policy "admins send events" on public.site_events for insert to authenticated with check (exists (select 1 from public.admins a where a.id = auth.uid()));
drop policy if exists "everyone reads bans" on public.bans;
create policy "everyone reads bans" on public.bans for select to anon, authenticated using (true);
drop policy if exists "admins add bans" on public.bans;
create policy "admins add bans" on public.bans for insert to authenticated with check (exists (select 1 from public.admins a where a.id = auth.uid()));
drop policy if exists "admins remove bans" on public.bans;
create policy "admins remove bans" on public.bans for delete to authenticated using (exists (select 1 from public.admins a where a.id = auth.uid()));

grant select on public.site_events, public.bans to anon, authenticated;
grant insert on public.site_events to authenticated;
grant insert, delete on public.bans to authenticated;
grant select on public.admins to authenticated;

-- Make the two owner GitHub accounts server admins (uses the GitHub identity, which users cannot fake):
insert into public.admins (id)
select user_id from auth.identities
where provider = 'github' and lower(identity_data->>'user_name') in ('x822-jpg','tugalevltv-debug')
on conflict do nothing;

-- Optional cleanup of old events:  delete from public.site_events where created_at < now() - interval '7 days';
