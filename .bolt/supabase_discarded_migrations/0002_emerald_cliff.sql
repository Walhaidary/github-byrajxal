/*
  # Update Profiles View Policy
  
  1. Changes
    - Modify existing view policy to include admin override
    - Allow admins to view all profiles
    - Regular users can still only view their own profile
*/

ALTER POLICY "Users can view own profile" 
ON "public"."profiles"
TO public
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);