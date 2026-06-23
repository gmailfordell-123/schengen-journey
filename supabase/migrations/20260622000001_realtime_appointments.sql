-- Add appointments to the Realtime publication so the customer status page
-- receives live UPDATE events when an admin changes appointment status.
-- Also drop the redundant status_history policies introduced by the previous
-- migration (the broader "admins: all" / "users: select own" policies remain).

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'appointments'
  ) then
    alter publication supabase_realtime add table public.appointments;
  end if;
end $$;

drop policy if exists "Users can view own status history" on public.status_history;
drop policy if exists "Admins can insert status history"  on public.status_history;
