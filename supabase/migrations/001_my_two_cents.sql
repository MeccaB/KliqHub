create extension if not exists "uuid-ossp";
create type public.app_role as enum ('user','business_owner','moderator','admin');
create type public.content_status as enum ('published','flagged','removed');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, name text not null, username text unique not null,
  avatar text, bio text, location text, reputation integer not null default 0, role public.app_role not null default 'user', created_at timestamptz not null default now()
);
create table public.businesses (
  id uuid primary key default uuid_generate_v4(), name text not null, category text[] not null default '{}', address text, city text not null, state text not null, zip text, phone text, website text, hours jsonb not null default '{}', description text, claimed boolean not null default false, owner_id uuid references public.profiles(id), average_rating numeric(2,1) not null default 0, review_count integer not null default 0, photos text[] not null default '{}', created_at timestamptz not null default now()
);
create table public.reviews (
  id uuid primary key default uuid_generate_v4(), business_id uuid not null references public.businesses(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5), title text not null check (char_length(title) between 3 and 120), body text not null check (char_length(body) between 20 and 5000), photos text[] not null default '{}', upvotes integer not null default 0, downvotes integer not null default 0, status public.content_status not null default 'published', created_at timestamptz not null default now(), edited_at timestamptz, unique(business_id,user_id)
);
create table public.comments (
 id uuid primary key default uuid_generate_v4(), review_id uuid not null references public.reviews(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, parent_comment_id uuid references public.comments(id) on delete cascade, body text not null check(char_length(body) between 1 and 1500), upvotes integer not null default 0, status public.content_status not null default 'published', created_at timestamptz not null default now()
);
create table public.votes (id uuid primary key default uuid_generate_v4(), user_id uuid not null references public.profiles(id) on delete cascade, target_type text not null check(target_type in ('review','comment')), target_id uuid not null, value smallint not null check(value in (-1,1)), created_at timestamptz not null default now(), unique(user_id,target_type,target_id));
create table public.reports (id uuid primary key default uuid_generate_v4(), target_type text not null, target_id uuid not null, reporter_id uuid not null references public.profiles(id), reason text not null, status text not null default 'open', created_at timestamptz not null default now());
create table public.business_responses (id uuid primary key default uuid_generate_v4(), business_id uuid not null references public.businesses(id), review_id uuid not null references public.reviews(id), responder_id uuid not null references public.profiles(id), body text not null, created_at timestamptz not null default now());
alter table public.profiles enable row level security; alter table public.businesses enable row level security; alter table public.reviews enable row level security; alter table public.comments enable row level security; alter table public.votes enable row level security;
create policy "public profiles" on public.profiles for select using (true); create policy "public businesses" on public.businesses for select using(true); create policy "public reviews" on public.reviews for select using(status='published'); create policy "public comments" on public.comments for select using(status='published');
create policy "self profile update" on public.profiles for update using(auth.uid()=id); create policy "self review insert" on public.reviews for insert with check(auth.uid()=user_id); create policy "self comment insert" on public.comments for insert with check(auth.uid()=user_id); create policy "self vote" on public.votes for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create index reviews_business_created on public.reviews(business_id,created_at desc); create index comments_review_created on public.comments(review_id,created_at); create index businesses_search on public.businesses using gin (to_tsvector('english', name || ' ' || city || ' ' || state));
create or replace function public.refresh_business_rating() returns trigger language plpgsql security definer as $$
declare bid uuid := coalesce(new.business_id,old.business_id); begin
 update public.businesses set review_count=(select count(*) from public.reviews where business_id=bid and status='published'), average_rating=coalesce((select round(avg(rating)::numeric,1) from public.reviews where business_id=bid and status='published'),0) where id=bid; return coalesce(new,old); end; $$;
create trigger refresh_rating after insert or update or delete on public.reviews for each row execute function public.refresh_business_rating();
