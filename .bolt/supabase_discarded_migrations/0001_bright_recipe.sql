/*
  # Administrative Tables Schema

  1. New Tables
    - service_providers: Stores company and contact information
    - services: Defines available services and pricing
    - user_permissions: Manages user roles and permissions
    
  2. Security
    - RLS enabled on all tables
    - Policies for proper access control
    
  3. Indexes
    - Optimized queries with appropriate indexes
*/

-- Service Providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  email text NOT NULL,
  phone text,
  vendor_number text NOT NULL UNIQUE,
  service_categories text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_company_name') THEN
    CREATE INDEX idx_service_providers_company_name ON service_providers(company_name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_email') THEN
    CREATE INDEX idx_service_providers_email ON service_providers(email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_vendor_number') THEN
    CREATE INDEX idx_service_providers_vendor_number ON service_providers(vendor_number);
  END IF;
END $$;

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_services_name') THEN
    CREATE INDEX idx_services_name ON services(name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_services_category') THEN
    CREATE INDEX idx_services_category ON services(category);
  END IF;
END $$;

-- User Permissions table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'supervisor', 'user')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  create_service boolean DEFAULT false,
  approve_service boolean DEFAULT false,
  manage_users boolean DEFAULT false,
  create_service_receipt boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_permissions_user_id') THEN
    CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_permissions_role') THEN
    CREATE INDEX idx_user_permissions_role ON user_permissions(role);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_providers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service providers are viewable by authenticated users') THEN
    CREATE POLICY "Service providers are viewable by authenticated users"
      ON service_providers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service providers are manageable by admins') THEN
    CREATE POLICY "Service providers are manageable by admins"
      ON service_providers
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_permissions
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for services
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Services are viewable by authenticated users') THEN
    CREATE POLICY "Services are viewable by authenticated users"
      ON services
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Services are manageable by admins') THEN
    CREATE POLICY "Services are manageable by admins"
      ON services
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_permissions
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for user_permissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User permissions are viewable by the owner and admins') THEN
    CREATE POLICY "User permissions are viewable by the owner and admins"
      ON user_permissions
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = user_id OR
        EXISTS (
          SELECT 1 FROM user_permissions
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User permissions are manageable by admins') THEN
    CREATE POLICY "User permissions are manageable by admins"
      ON user_permissions
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_permissions
          WHERE user_id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_service_providers_updated_at') THEN
    CREATE TRIGGER update_service_providers_updated_at
      BEFORE UPDATE ON service_providers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
    CREATE TRIGGER update_services_updated_at
      BEFORE UPDATE ON services
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_permissions_updated_at') THEN
    CREATE TRIGGER update_user_permissions_updated_at
      BEFORE UPDATE ON user_permissions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;