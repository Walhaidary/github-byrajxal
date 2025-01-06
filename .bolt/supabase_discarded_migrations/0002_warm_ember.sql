/*
  # User Roles System Setup
  
  1. Schema Changes
    - Creates user_role_level enum type for role management
    - Creates user_roles table with role tracking
  
  2. Security
    - Enables RLS on user_roles table
    - Adds policies for role viewing and management
    
  3. Automation
    - Adds updated_at timestamp trigger
*/

-- Create enum for role levels if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_level') THEN
        CREATE TYPE user_role_level AS ENUM ('user', 'supervisor', 'admin');
    END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role_level user_role_level NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
    DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
END $$;

-- Create policies
CREATE POLICY "Users can view their own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
    ON user_roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Safely create trigger
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();