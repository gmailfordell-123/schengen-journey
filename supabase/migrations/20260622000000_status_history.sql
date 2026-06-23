-- status_history table tracks every status change on an appointment

create table if not exists public.status_history (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  changed_by     uuid references public.user_profiles(id) on delete set null,
  old_status     public.appointment_status,
  new_status     public.appointment_status not null,
  notes          text,
  created_at     timestamptz not null default now()
);

create index if not exists status_history_appointment_idx on public.status_history(appointment_id);
create index if not exists status_history_created_idx    on public.status_history(created_at desc);

-- RLS: users can read their own appointment history; admins can insert
alter table public.status_history enable row level security;

create policy "Users can view own status history"
  on public.status_history for select
  using (
    exists (
      select 1 from public.appointments a
      where a.id = status_history.appointment_id
        and a.user_id = auth.uid()
    )
  );

create policy "Admins can insert status history"
  on public.status_history for insert
  with check (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Realtime: enable on status_history so clients can subscribe
alter publication supabase_realtime add table public.status_history;
