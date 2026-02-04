-- 1. DISABLE RLS (Temporarily for testing)
alter table profiles disable row level security;
alter table posts disable row level security;
alter table mood_logs disable row level security;
alter table comments disable row level security;
alter table reports disable row level security;
alter table quiz_results disable row level security;

-- 2. CREATE A HARDCODED TEST USER PROFILE
-- We use a fixed UUID so we can hardcode it in the frontend/backend
insert into profiles (id, email, role, full_name, points, level)
values 
  ('11111111-1111-1111-1111-111111111111', 'test@demo.com', 'admin', 'Test User', 100, 2)
on conflict (id) do update 
set role = 'admin'; -- Ensure it's admin so you can test everything
