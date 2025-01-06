/*
  # Add Admin User
  
  1. Changes
    - Assigns admin role to specified user
  
  2. Security
    - Maintains existing RLS policies
    - Uses secure UUID handling
*/

-- Add admin role for the user
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get the user's ID from their email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'wal.haidary@gmail.com';

    -- Insert or update the user's role to admin
    INSERT INTO user_roles (user_id, role_level)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET role_level = 'admin'
    WHERE user_roles.user_id = v_user_id;
END $$;