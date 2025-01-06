/*
  # Add User Roles and Permissions
  
  1. Changes
    - Creates user_role_level enum if not exists
    - Creates user_roles table if not exists
    - Assigns admin role to specified user
  
  2. Security
    - Enables RLS on user_roles table
    - Ensures proper access control
*/

-- Create enum type if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_level') THEN
        CREATE TYPE user_role_level AS ENUM ('user', 'supervisor', 'admin');
    END IF;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    role_level user_role_level NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Add admin role for the specified user
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get the user's ID from their email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'wal.haidary@gmail.com';

    IF v_user_id IS NOT NULL THEN
        -- Insert or update the user's role to admin
        INSERT INTO user_roles (user_id, role_level)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role_level = 'admin'
        WHERE user_roles.user_id = v_user_id;
    END IF;
END $$;