-- Insert all existing users as admins
insert into public.user_roles (user_id, role)
select 
    id as user_id,
    'admin'::app_role as role
from auth.users
where id not in (
    -- Exclude users that already have a role
    select user_id from public.user_roles
)
on conflict (id) do nothing;
