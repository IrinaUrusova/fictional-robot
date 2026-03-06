create table if not exists companies (
id uuid primary key,
name text not null,
created_at timestamptz not null default now()
);
