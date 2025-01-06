/*
  # User Roles and Permissions Schema

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role_level` (enum: user, supervisor, admin)
      - `status` (enum: active, inactive)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_permissions`
      - `id` (uuid, primary key) 
      - `user_id` (uuid, references auth.users)
      - `create_service` (boolean)
      - `approve_service` (boolean)
      - `manage_users` (boolean)
      - `create_service_receipt` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create role level enum
CREATE TYPE user_role_level AS ENUM ('user', 'supervisor', 'admin');

-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role_level user_role_level NOT NULL DEFAULT 'user',
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Create user permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    create_service boolean DEFAULT false,
    approve_service boolean DEFAULT false,
    manage_users boolean DEFAULT false,
    create_service_receipt boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own role"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

CREATE POLICY "Admins can manage roles"
    ON user_roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

-- Create policies for user_permissions
CREATE POLICY "Users can view their own permissions"
    ON user_permissions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all permissions"
    ON user_permissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

CREATE POLICY "Admins can manage permissions"
    ON user_permissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Create default user role
    INSERT INTO user_roles (user_id, role_level)
    VALUES (NEW.id, 'user');

    -- Create default permissions
    INSERT INTO user_permissions (
        user_id,
        create_service,
        approve_service,
        manage_users,
        create_service_receipt
    )
    VALUES (
        NEW.id,
        true,  -- All users can create services by default
        false, -- Only supervisors/admins can approve
        false, -- Only admins can manage users
        true   -- All users can create receipts
    );

    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();