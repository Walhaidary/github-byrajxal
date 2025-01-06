/*
  # Simplify Authentication Schema
  
  1. Changes
    - Remove role_permissions table
    - Remove role-based policies
    - Keep basic user authentication
*/

-- Drop role_permissions table if exists
DROP TABLE IF EXISTS role_permissions;

-- Drop role-specific types
DROP TYPE IF EXISTS user_role_level CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;

-- Modify user_roles table to remove role-based columns
ALTER TABLE IF EXISTS user_roles 
  DROP COLUMN IF EXISTS role_level,
  DROP COLUMN IF EXISTS status;

-- Update users table policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users are viewable by admins" ON users;
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  
  -- Create simple user policy
  CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());
END $$;