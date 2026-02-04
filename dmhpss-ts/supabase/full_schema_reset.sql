-- 1. Reset/Cleanup (Optional - Use carefully if you want to wipe data)
-- drop table if exists comments cascade;
-- drop table if exists mood_logs cascade;
-- drop table if exists posts cascade;
-- drop table if exists profiles cascade;
-- drop table if exists reports cascade;
-- drop table if exists quiz_results cascade;
-- drop table if exists activity_logs cascade;
-- drop table if exists conversations cascade;
-- drop table if exists direct_messages cascade;
-- drop table if exists post_likes cascade;

-- 2. Create Profiles Table (Actors)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null check (role in ('user', 'counselor', 'moderator', 'admin')),
  full_name text,
  counselor_id uuid references profiles(id), -- For User assignment
  specialization text, -- For Counselors
  phone_number text, 
  date_of_birth date,
  points integer default 0 not null,
  level integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 3. Create Posts Table (User Concerns)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text, -- Added title
  content text not null,
  case_status text not null check (case_status in ('open', 'pending', 'resolved')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone." on posts for select using (true);
create policy "Users can create posts." on posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts." on posts for update using (auth.uid() = user_id);

-- 3.1 Create Post Likes Table
create table if not exists post_likes (
  user_id uuid references auth.users not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

alter table post_likes enable row level security;

create policy "Public likes" on post_likes for select using (true);
create policy "Users can like" on post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on post_likes for delete using (auth.uid() = user_id);

-- 4. Create Comments Table (Responses)
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Users can insert their own comments." on comments for insert with check (auth.uid() = user_id);

-- 5. Create Mood Logs Table (Mood Tracker)
create table if not exists mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table mood_logs enable row level security;

create policy "Users can view their own mood logs." on mood_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own mood logs." on mood_logs for insert with check (auth.uid() = user_id);

-- 6. Create Reports Table (Moderation)
create table if not exists reports (
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
create policy "Users can insert their own reports." on reports for insert with check (auth.uid() = reporter_id);

-- 7. Create Quiz Results Table (Gamification/Health)
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  score integer not null,
  max_score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table quiz_results enable row level security;

create policy "Users can view their own quiz results." on quiz_results for select using (auth.uid() = user_id);
create policy "Counselors can view all quiz results." on quiz_results
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and role = 'counselor'
    )
  );
create policy "Users can insert their own quiz results." on quiz_results for insert with check (auth.uid() = user_id);

-- 8. Create Activity Logs Table
create table if not exists activity_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users not null,
  action_type text not null,
  description text not null,
  target_entity text,
  target_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table activity_logs enable row level security;

create policy "Admins can view all activity logs." on activity_logs
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and role = 'admin'
    )
  );

-- 9. Create Conversations Table
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users not null,
  counselor_id uuid references auth.users,
  status text default 'active'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table conversations enable row level security;

create policy "Users can view own conversations" on conversations
for select using (
  (auth.uid() = student_id) OR 
  (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['counselor'::text, 'admin'::text])))))
);

create policy "Users can create conversations" on conversations
for insert with check (auth.uid() = student_id);

-- 10. Create Direct Messages Table
create table if not exists direct_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table direct_messages enable row level security;

create policy "Users can view messages in their conversations" on direct_messages
for select using (
  EXISTS ( 
    SELECT 1 FROM conversations 
    WHERE conversations.id = direct_messages.conversation_id 
    AND (
      conversations.student_id = auth.uid() 
      OR conversations.counselor_id = auth.uid() 
      OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['counselor'::text, 'admin'::text]))
    )
  )
);

create policy "Users can send messages to their conversations" on direct_messages
for insert with check (
  EXISTS ( 
    SELECT 1 FROM conversations 
    WHERE conversations.id = direct_messages.conversation_id 
    AND (
      conversations.student_id = auth.uid() 
      OR conversations.counselor_id = auth.uid() 
      OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['counselor'::text, 'admin'::text]))
    )
  )
);

-- 11. Functions and Triggers (CRITICAL)

-- Function: Handle New User Signup (Auto-create Profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id, 
    new.email, 
    'user', 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User')
  )
  on conflict (id) do nothing; -- Prevent errors if profile exists
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: On Auth User Created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function: Gamification Update
create or replace function update_user_points(user_uuid uuid, points_to_add int)
returns void as $$
declare
  current_points int;
  new_points int;
  new_level int;
begin
  select points into current_points from profiles where id = user_uuid;
  if current_points is null then current_points := 0; end if;
  
  new_points := current_points + points_to_add;
  new_level := (new_points / 100) + 1;
  
  update profiles 
  set points = new_points, 
      level = new_level 
  where id = user_uuid;
end;
$$ language plpgsql security definer;
