/*
  # Admin Role Override Implementation

  1. Changes
    - Add admin role override capabilities
    - Modify RLS policies to check for admin role
    - Add helper function for admin role check

  2. Security
    - Only users with admin role can bypass RLS policies
    - Admin check is implemented via a reusable function
*/

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing policies to include admin override
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own data" ON profiles;
  DROP POLICY IF EXISTS "Users can update own data" ON profiles;
  
  -- Recreate policies with admin override
  CREATE POLICY "Users can read own data or admins can read all"
    ON profiles
    FOR SELECT
    USING (
      id = auth.uid() 
      OR 
      is_admin()
    );

  CREATE POLICY "Users can update own data or admins can update all"
    ON profiles
    FOR UPDATE
    USING (
      id = auth.uid() 
      OR 
      is_admin()
    )
    WITH CHECK (
      id = auth.uid() 
      OR 
      is_admin()
    );

  -- Add admin-only delete policy
  CREATE POLICY "Only admins can delete"
    ON profiles
    FOR DELETE
    USING (is_admin());

END $$;