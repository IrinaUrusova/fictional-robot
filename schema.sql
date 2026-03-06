create table if not exists companies (
id uuid primary key,
name text not null,
created_at timestamptz not null default now()
);
create table if not exists users (
id uuid primary key,
company_id uuid not null references companies(id),
name text not null,
email text not null unique,
role text not null,
created_at timestamptz not null default now()
);
