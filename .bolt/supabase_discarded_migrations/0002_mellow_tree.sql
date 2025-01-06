/*
  # Role Permissions Schema

  1. New Tables
    - `role_permissions` - Stores role-based permissions mapping
      - `id` (uuid, primary key)
      - `role_level` (user_role_level)
      - `permission_name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on role_permissions table
    - Add default permissions for all role levels
*/

-- Create role_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_level user_role_level NOT NULL,
    permission_name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (role_level, permission_name)
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

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