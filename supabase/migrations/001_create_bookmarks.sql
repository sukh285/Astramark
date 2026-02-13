-- 001_create_bookmarks.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- BOOKMARKS TABLE
create table if not exists public.bookmarks (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid not null references auth.users(id) on delete cascade,

    url text not null,
    title text not null,

    collection_id uuid null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- fast user-specific queries (dashboard)
create index if not exists idx_bookmarks_user_id on public.bookmarks (user_id);

-- Sorting optimization
create index if not exists idx_bookmarks_created_at on public.bookmarks (created_at desc);

-- ROW LEVEL SECURITY (MANDATORY)
alter table public.bookmarks enable row level security;

-- Users can ONLY view their own bookmarks
create policy "Users can view their own bookmarks" on public.bookmarks for
select using (auth.uid() = user_id);

-- Users can ONLY insert their own bookmarks
create policy "Users can insert their own bookmarks" on public.bookmarks for
insert with check (auth.uid() = user_id);

-- Users can ONLY delete their own bookmarks
create policy "Users can delete their own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- Users can ONLY update their own bookmarks (future edits)
create policy "Users can update their own bookmarks" on public.bookmarks for
update using (auth.uid() = user_id);

-- REALTIME ENABLEMENT
alter publication supabase_realtime
add table public.bookmarks;