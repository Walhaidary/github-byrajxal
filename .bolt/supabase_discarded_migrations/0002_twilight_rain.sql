/*
  # Role Permissions Setup
  
  1. Schema Changes
    - Creates role_permissions table to store granular permissions per role
  
  2. Security
    - Enables RLS
    - Sets up view and manage policies
    
  3. Data
    - Safely inserts default permissions for all role levels
*/

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_level user_role_level NOT NULL,
    permission_name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (role_level, permission_name)
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view role permissions" ON role_permissions;
    DROP POLICY IF EXISTS "Only admins can manage permissions" ON role_permissions;
END $$;

-- Create policies
CREATE POLICY "Anyone can view role permissions"
    ON role_permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can manage permissions"
    ON role_permissions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_level = 'admin'
        )
    );

-- Insert default permissions safely
DO $$
DECLARE
    permissions text[][] := ARRAY[
        -- Level 1 - Normal User
        ['user', 'new_service.read'],
        ['user', 'new_service.write'],
        
        -- Level 2 - Supervisor
        ['supervisor', 'new_service.read'],
        ['supervisor', 'new_service.write'],
        ['supervisor', 'validate_service.read'],
        ['supervisor', 'validate_service.write'],
        
        -- Level 3 - Administrator
        ['admin', 'new_service.read'],
        ['admin', 'new_service.write'],
        ['admin', 'validate_service.read'],
        ['admin', 'validate_service.write'],
        ['admin', 'admin.read'],
        ['admin', 'admin.write'],
        ['admin', 'admin.delete'],
        ['admin', 'admin.manage_users']
    ];
    p text[];
BEGIN
    FOREACH p SLICE 1 IN ARRAY permissions
    LOOP
        INSERT INTO role_permissions (role_level, permission_name)
        VALUES (p[1]::user_role_level, p[2])
        ON CONFLICT (role_level, permission_name) DO NOTHING;
    END LOOP;
END $$;