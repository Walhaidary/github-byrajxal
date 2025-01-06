/*
  # Update profiles policy for admin access

  1. Security Changes
    - Drop all existing profile policies
    - Re-create policy to allow admins to view all profiles
    - Allow users to view their own profile

  2. Changes
    - Drop existing policies to avoid conflicts
    - Create new consolidated policy for profile access
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON profiles;

-- Create new policy that allows users to view their own profile and admins to view all
CREATE POLICY "Users can view own profile or admins view all"
ON profiles
FOR SELECT 
TO public
USING (
    auth.uid() = id 
    OR 
    EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);