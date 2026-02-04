-- Add points column to profiles for gamification
alter table profiles 
add column points integer default 0 not null,
add column level integer default 1 not null;

-- Create function to update points and level
create or replace function update_user_points(user_uuid uuid, points_to_add int)
returns void as $$
declare
  current_points int;
  new_points int;
  new_level int;
begin
  select points into current_points from profiles where id = user_uuid;
  new_points := current_points + points_to_add;
  
  -- Simple logic: Level up every 100 points
  new_level := (new_points / 100) + 1;
  
  update profiles 
  set points = new_points, 
      level = new_level 
  where id = user_uuid;
end;
$$ language plpgsql security definer;
