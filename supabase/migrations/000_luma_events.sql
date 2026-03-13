-- Luma events cache table
create table if not exists luma_events (
  id text primary key,            -- Luma event api_id
  title text not null,
  date text not null,             -- YYYY-MM-DD
  time text not null,             -- e.g. "8:00 PM"
  time_zone text not null default 'MYT',
  location text not null default 'TBA',
  luma_url text not null,
  cover_url text not null default '',
  organizers jsonb not null default '[]',
  period text not null default 'future',  -- 'future' or 'past'
  start_at timestamptz not null,          -- original start time for ordering
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Index for fast queries by period + date ordering
create index if not exists idx_luma_events_period on luma_events (period, start_at desc);

-- Cache metadata table to track last sync time
create table if not exists luma_sync_meta (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
