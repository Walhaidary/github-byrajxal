/*
  # Add Admin User
  
  1. Changes
    - Adds admin role for user wal.haidary@gmail.com
  
  2. Security
    - Uses secure UUID lookup for the user
*/

DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get the user's ID from their email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'wal.haidary@gmail.com';

    -- Insert or update the user's role to admin
    INSERT INTO user_roles (user_id, role_level)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET role_level = 'admin';
END $$;