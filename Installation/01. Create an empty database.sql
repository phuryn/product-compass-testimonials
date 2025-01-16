-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type public.app_role as enum ('admin', 'user');

-- Create tables
create table public.branding (
    key text primary key,
    value text not null,
    updated_at timestamp with time zone default current_timestamp
);

create table public.tags (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_at timestamp with time zone default current_timestamp
);

create table public.testimonials (
    id uuid primary key default gen_random_uuid(),
    author jsonb not null,
    rating integer not null,
    text text not null,
    date timestamp with time zone default current_timestamp,
    tags text[] default array[]::text[],
    approved boolean default false
);

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade,
    role app_role default 'user'::app_role,
    created_at timestamp with time zone default current_timestamp
);

-- Create the sanitize_author_for_public function
create or replace function public.sanitize_author_for_public(author jsonb)
returns jsonb
language plpgsql
security definer
as $$
begin
  return author - 'email';
end;
$$;

-- Create public_testimonials view
create view public_testimonials as
    select 
        id,
        author,
        rating,
        text,
        date,
        tags,
        approved
    from testimonials;

-- Enable Row Level Security
alter table public.branding enable row level security;
alter table public.tags enable row level security;
alter table public.testimonials enable row level security;
alter table public.user_roles enable row level security;

-- Branding policies
create policy "Everyone can read branding"
    on public.branding for select
    to authenticated, anon
    using (true);

create policy "Only admins can insert branding"
    on public.branding for insert
    to authenticated
    with check (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

create policy "Only admins can update branding"
    on public.branding for update
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

create policy "Only admins can delete branding"
    on public.branding for delete
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

-- Tags policies
create policy "Everyone can read tags"
    on public.tags for select
    to authenticated, anon
    using (true);

create policy "Only admins can insert tags"
    on public.tags for insert
    to authenticated
    with check (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

create policy "Only admins can update tags"
    on public.tags for update
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

create policy "Only admins can delete tags"
    on public.tags for delete
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

-- Testimonials policies
create policy "Enable read access for all users"
    on public.testimonials for select
    to authenticated, anon
    using (true);

create policy "Enable insert access for all users"
    on public.testimonials for insert
    to authenticated, anon
    with check (true);

create policy "Only admins can update testimonials"
    on public.testimonials for update
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

create policy "Only admins can delete testimonials"
    on public.testimonials for delete
    to authenticated
    using (exists (
        select 1 from user_roles
        where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    ));

-- User roles policies
create policy "Users can read their own role"
    on public.user_roles for select
    to authenticated
    using (auth.uid() = user_id);

-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
    ('author-photos', 'author-photos', true),
    ('branding-assets', 'branding-assets', true);

-- Storage policies for author-photos
create policy "Public access to author photos"
    on storage.objects for select
    to public
    using (bucket_id = 'author-photos');

create policy "Authenticated users can upload author photos"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'author-photos');

-- Storage policies for branding-assets
create policy "Public access to branding assets"
    on storage.objects for select
    to public
    using (bucket_id = 'branding-assets');

create policy "Admins can manage branding assets"
    on storage.objects for all
    to authenticated
    using (
        bucket_id = 'branding-assets'
        and exists (
            select 1 from public.user_roles
            where user_roles.user_id = auth.uid()
            and user_roles.role = 'admin'
        )
    );
