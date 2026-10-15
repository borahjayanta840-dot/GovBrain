create table public.official_source_monitor_state (
  source_id uuid primary key references public.service_sources(id) on delete cascade,
  content_hash text not null check (content_hash ~ '^[0-9a-f]{64}$'),
  last_checked_at timestamptz not null default now()
);

create table public.official_source_updates (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.service_sources(id) on delete cascade,
  source_title text not null,
  source_url text not null,
  page_title text not null,
  excerpt text not null,
  is_baseline boolean not null default false,
  detected_at timestamptz not null default now()
);

create index official_source_updates_detected_at_idx
  on public.official_source_updates(detected_at desc);

alter table public.official_source_monitor_state enable row level security;
alter table public.official_source_updates enable row level security;

create policy "Public can read updates from verified published sources"
  on public.official_source_updates
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.service_sources
      join public.services on services.id = service_sources.service_id
      where service_sources.id = official_source_updates.source_id
        and service_sources.status = 'verified'
        and services.status = 'published'
    )
  );

grant select on public.official_source_updates to anon, authenticated;

create or replace function public.record_official_source_check(
  p_source_id uuid,
  p_content_hash text,
  p_page_title text,
  p_excerpt text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  source_row public.service_sources%rowtype;
  previous_hash text;
  has_previous boolean;
  has_changed boolean;
begin
  if p_content_hash is null
    or p_page_title is null
    or p_excerpt is null
    or p_content_hash !~ '^[0-9a-f]{64}$'
    or length(p_page_title) > 200
    or length(p_excerpt) > 500 then
    raise exception 'Invalid official source check payload.';
  end if;

  select *
    into source_row
    from public.service_sources
    where id = p_source_id and status = 'verified'
    for update;

  if not found then
    raise exception 'Verified source was not found.';
  end if;

  select content_hash
    into previous_hash
    from public.official_source_monitor_state
    where source_id = p_source_id;
  has_previous := found;
  has_changed := has_previous and previous_hash is distinct from p_content_hash;

  if not has_previous or has_changed then
    insert into public.official_source_updates (
      source_id, source_title, source_url, page_title, excerpt, is_baseline
    ) values (
      source_row.id, source_row.source_title, source_row.source_url,
      p_page_title, p_excerpt, not has_previous
    );
  end if;

  insert into public.official_source_monitor_state (source_id, content_hash, last_checked_at)
  values (p_source_id, p_content_hash, now())
  on conflict (source_id) do update
    set content_hash = excluded.content_hash,
        last_checked_at = excluded.last_checked_at;

  return has_changed;
end;
$$;

revoke all on function public.record_official_source_check(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function public.record_official_source_check(uuid, text, text, text)
  to service_role;
