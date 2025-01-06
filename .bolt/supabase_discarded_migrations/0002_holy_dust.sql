/*
  # Remove RLS policies and allow full access

  1. Changes
    - Disable RLS on all tables
    - Remove existing policies
  
  2. Security
    - All authenticated users have full access to all tables
    - No restrictions on data access
*/

-- Disable RLS on all tables
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
BEGIN
    -- Services policies
    DROP POLICY IF EXISTS "Users can view services" ON services;
    DROP POLICY IF EXISTS "Users can manage services" ON services;

    -- Service providers policies
    DROP POLICY IF EXISTS "Users can view service providers" ON service_providers;
    DROP POLICY IF EXISTS "Users can manage service providers" ON service_providers;

    -- User roles policies
    DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

    -- Role permissions policies
    DROP POLICY IF EXISTS "Anyone can view role permissions" ON role_permissions;
    DROP POLICY IF EXISTS "Only admins can manage permissions" ON role_permissions;
END $$;