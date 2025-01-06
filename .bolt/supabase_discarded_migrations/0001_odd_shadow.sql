/*
  # User Permissions Policies

  1. Security Changes
    - Enable RLS on user_permissions table
    - Add policies for:
      - Users can read their own permissions
      - Admins can manage all permissions
      - Prevent recursive policy checks
*/

-- Enable RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;
    DROP POLICY IF EXISTS "Admins can manage all permissions" ON user_permissions;
END $$;

-- Create clear, non-recursive policies
CREATE POLICY "Users can view own permissions"
ON user_permissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admin policy using a subquery to check admin status
CREATE POLICY "Admins can manage all permissions"
ON user_permissions 
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_permissions up 
        WHERE up.user_id = auth.uid() 
        AND up.role = 'admin'
        AND up.status = 'active'
    )
);