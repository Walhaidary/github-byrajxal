/*
  # Fix Service and Permission Policies

  1. Changes
    - Create proper RLS policies for services and user_permissions tables
    - Remove existing problematic policies
    - Set up proper access control
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up admin-specific policies
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'supervisor', 'user')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  create_service boolean DEFAULT false,
  approve_service boolean DEFAULT false,
  manage_users boolean DEFAULT false,
  create_service_receipt boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can create services" ON services;
DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;
DROP POLICY IF EXISTS "Admins can manage all permissions" ON user_permissions;

-- Services policies
CREATE POLICY "Enable read access for authenticated users"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User permissions policies
CREATE POLICY "Users can view their own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access"
  ON user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND status = 'active'
    )
  );