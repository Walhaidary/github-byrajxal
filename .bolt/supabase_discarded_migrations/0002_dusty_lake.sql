/*
  # User Roles and Permissions Schema

  1. New Types
    - user_role_level enum for role levels
    - user_status enum for account status

  2. New Tables
    - users: Links to auth.users and stores additional user info
    - user_roles: Stores user role assignments
    - role_permissions: Stores permissions for each role level

  3. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create custom types
CREATE TYPE user_role_level AS ENUM ('user', 'supervisor', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_level user_role_level DEFAULT 'user',
  status user_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_level user_role_level NOT NULL,
  permission_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (role_level, permission_name)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);

  -- Insert into user_roles table with default role
  INSERT INTO user_roles (user_id, role_level, status)
  VALUES (NEW.id, 'user', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert default permissions
INSERT INTO role_permissions (role_level, permission_name)
VALUES
  -- User permissions
  ('user', 'new_service.read'),
  ('user', 'new_service.write'),
  
  -- Supervisor permissions
  ('supervisor', 'new_service.read'),
  ('supervisor', 'new_service.write'),
  ('supervisor', 'validate_service.read'),
  ('supervisor', 'validate_service.write'),
  
  -- Admin permissions
  ('admin', 'new_service.read'),
  ('admin', 'new_service.write'),
  ('admin', 'validate_service.read'),
  ('admin', 'validate_service.write'),
  ('admin', 'admin.read'),
  ('admin', 'admin.write')
ON CONFLICT (role_level, permission_name) DO NOTHING;