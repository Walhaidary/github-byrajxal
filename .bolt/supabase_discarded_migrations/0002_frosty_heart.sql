/*
  # User Management Schema

  1. New Tables
    - `users` - Mirror of auth.users for easier querying
      - `id` (uuid, primary key) - References auth.users.id
      - `email` (text) - User's email address
      - `created_at` (timestamptz) - When user was created
    
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `role_level` (enum) - User's role level
      - `status` (enum) - Account status
      - `created_at` (timestamptz) - When role was assigned

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_level user_role_level DEFAULT 'user',
  status user_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users are viewable by admins" ON users;
  DROP POLICY IF EXISTS "User roles are viewable by admins" ON user_roles;
  DROP POLICY IF EXISTS "User roles are updatable by admins" ON user_roles;
END $$;

CREATE POLICY "Users are viewable by admins"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level = 'admin'
      AND status = 'active'
    )
  );

CREATE POLICY "User roles are viewable by admins"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level = 'admin'
      AND status = 'active'
    )
  );

CREATE POLICY "User roles are updatable by admins"
  ON user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level = 'admin'
      AND status = 'active'
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);

  -- Insert into user_roles table
  INSERT INTO user_roles (user_id, role_level, status)
  VALUES (NEW.id, 'user', 'pending');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();