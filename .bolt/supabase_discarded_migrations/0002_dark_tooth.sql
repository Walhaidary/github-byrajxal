/*
  # Fix user roles policies

  1. Changes
    - Remove existing policies from user_roles table
    - Add new policies for user role management
  
  2. Security
    - Users can view their own role
    - Only users with admin.manage_users permission can manage roles
*/

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
END $$;

-- Create new policies
CREATE POLICY "Users can view their own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admin policy using role_permissions table
CREATE POLICY "Admins can manage all roles"
    ON user_roles 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM role_permissions rp
            WHERE rp.permission_name = 'admin.manage_users'
            AND rp.role_level = (
                SELECT role_level FROM user_roles
                WHERE user_id = auth.uid()
                LIMIT 1
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM role_permissions rp
            WHERE rp.permission_name = 'admin.manage_users'
            AND rp.role_level = (
                SELECT role_level FROM user_roles
                WHERE user_id = auth.uid()
                LIMIT 1
            )
        )
    );