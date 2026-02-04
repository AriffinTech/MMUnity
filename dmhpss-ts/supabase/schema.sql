-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text not null check (role in ('user', 'counselor', 'moderator', 'admin')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create table for posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  case_status text not null check (case_status in ('open', 'pending', 'resolved')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table posts enable row level security;

-- Create policies for posts
create policy "Posts are viewable by everyone." on posts
  for select using (true);

create policy "Users can create posts." on posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts." on posts
  for update using (auth.uid() = user_id);

-- Create table for mood logs
create table mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table mood_logs enable row level security;

-- Create policies for mood_logs
create policy "Users can view their own mood logs." on mood_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own mood logs." on mood_logs
  for insert with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (new.id, new.email, 'user', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create table for comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone." on comments
  for select using (true);

create policy "Users can insert their own comments." on comments
  for insert with check (auth.uid() = user_id);

-- Create table for reports
create table reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references auth.users not null,
  post_id uuid references posts(id) on delete set null,
  comment_id uuid references comments(id) on delete set null,
  reason text not null,
  status text not null check (status in ('pending', 'reviewed', 'resolved')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (post_id is not null or comment_id is not null)
);

alter table reports enable row level security;

create policy "Admins and Moderators can view all reports." on reports
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "Users can insert their own reports." on reports
  for insert with check (auth.uid() = reporter_id);

-- Create table for quiz results
create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  score integer not null,
  max_score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table quiz_results enable row level security;

create policy "Users can view their own quiz results." on quiz_results
  for select using (auth.uid() = user_id);
  
create policy "Counselors can view all quiz results." on quiz_results
  for select using (
     exists (
      select 1 from profiles
      where profiles.id = auth.uid() and role = 'counselor'
    )
  );

create policy "Users can insert their own quiz results." on quiz_results
  for insert with check (auth.uid() = user_id);
