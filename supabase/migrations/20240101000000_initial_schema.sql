-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  goals jsonb default '[]'::jsonb, -- e.g. ["peace", "discipline"]
  phase integer default 1, -- 1: Despertar, 2: Disciplina, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true); -- Adjust privacy as needed

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INTENTIONS (Daily intent)
create table public.intentions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  category text, -- e.g. "focus", "kindness"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date default CURRENT_DATE
);

alter table public.intentions enable row level security;

create policy "Users can CRUD their own intentions" on public.intentions
  for all using (auth.uid() = user_id);

-- DAILY PRACTICES (Checklist items)
create table public.daily_practices (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  category text,
  completed boolean default false,
  completed_at timestamp with time zone,
  date date default CURRENT_DATE,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.daily_practices enable row level security;

create policy "Users can CRUD their own practices" on public.daily_practices
  for all using (auth.uid() = user_id);

-- NIGHTLY REVIEWS
create table public.nightly_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  answers jsonb not null, -- Structured answers
  sentiment text, -- "positive", "neutral", "negative"
  date date default CURRENT_DATE,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.nightly_reviews enable row level security;

create policy "Users can CRUD their own reviews" on public.nightly_reviews
  for all using (auth.uid() = user_id);

-- MICRO ACTS
create table public.micro_acts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  status text default 'pending', -- pending, completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.micro_acts enable row level security;

create policy "Users can CRUD their own micro acts" on public.micro_acts
  for all using (auth.uid() = user_id);

-- STREAKS / PROGRESS
create table public.user_stats (
  user_id uuid references public.profiles(id) primary key,
  current_streak integer default 0,
  max_streak integer default 0,
  total_practices integer default 0,
  last_activity_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_stats enable row level security;

create policy "Users can view their own stats" on public.user_stats
  for select using (auth.uid() = user_id);

-- CIRCLES (Community)
create table public.circles (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references public.profiles(id),
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.circles enable row level security;

create policy "Anyone can view public circles" on public.circles
  for select using (NOT is_private);

create policy "Members can view private circles" on public.circles
  for select using (
    auth.uid() in (
      select user_id from public.circle_members where circle_id = id
    )
  );

create policy "Creators can update circles" on public.circles
  for update using (auth.uid() = created_by);

-- CIRCLE MEMBERS
create table public.circle_members (
  circle_id uuid references public.circles(id) not null,
  user_id uuid references public.profiles(id) not null,
  role text default 'member', -- member, moderator, admin
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (circle_id, user_id)
);

alter table public.circle_members enable row level security;

create policy "Users can view members of their circles" on public.circle_members
  for select using (
    exists (
      select 1 from public.circle_members cm 
      where cm.circle_id = circle_members.circle_id 
      and cm.user_id = auth.uid()
    )
  );

create policy "Anyone can join public circles" on public.circle_members
  for insert with check (
    exists (
      select 1 from public.circles c
      where c.id = circle_id and not c.is_private
    )
  );

-- REPORTS (Moderation)
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id),
  target_id uuid not null, -- ID of content/user being reported
  target_type text not null, -- "circle", "post", "user"
  reason text not null,
  status text default 'pending', -- pending, reviewed, resolved
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;

create policy "Users can create reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- Only admins/moderators can view reports (RLS for staff would be separate)

-- PUSH NOTIFICATION PREFERENCES
create table public.notification_prefs (
  user_id uuid references public.profiles(id) primary key,
  endpoint text,
  p256dh text,
  auth text,
  preferences jsonb default '{"daily_reminder": true, "circles": true}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.notification_prefs enable row level security;

create policy "Users can manage their own notifications" on public.notification_prefs
  for all using (auth.uid() = user_id);
