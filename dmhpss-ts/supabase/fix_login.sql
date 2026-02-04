-- FORCE VERIFY ALL USERS (Fixes "Login Failed" after Signup)
update auth.users
set email_confirmed_at = now(),
    confirmed_at = now()
where email_confirmed_at is null;

-- ENSURE PROFILES EXIST (Fixes "User not found" in app)
insert into public.profiles (id, email, role, full_name)
select id, email, 'user', coalesce(raw_user_meta_data->>'full_name', 'Student')
from auth.users
where id not in (select id from public.profiles);

-- CREATE TEST USERS (Requires pgcrypto for password hashing, might not work if extension missing)
-- Instead, we just fix the existing ones.
