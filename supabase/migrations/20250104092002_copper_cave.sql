/*
  # Initial Schema Setup

  1. Tables
    - profiles
      - User profiles with roles and permissions
    - service_providers
      - Service provider companies and their details
    - services
      - Available services offered by providers
    - service_receipts
      - Service receipt records
    - service_receipt_items
      - Individual items within service receipts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Set up proper foreign key relationships

  3. Indexes
    - Add indexes for frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Service Providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active service providers"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admin users can manage service providers"
  ON service_providers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text,
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  provider_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Service Receipts table
CREATE TABLE IF NOT EXISTS service_receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number text NOT NULL UNIQUE,
  warehouse_number text NOT NULL,
  service_provider_name text NOT NULL,
  service_provider_code text NOT NULL,
  wbs text NOT NULL,
  service_date date NOT NULL,
  storekeeper_name text NOT NULL,
  helper_field numeric(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_date timestamptz,
  paid_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_by_name text,
  approved_at timestamptz
);

ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read receipts"
  ON service_receipts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create receipts"
  ON service_receipts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admin and supervisors can update receipts"
  ON service_receipts
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'supervisor')
  ));

-- Service Receipt Items table
CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id uuid REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  service_name text NOT NULL,
  service_cost numeric(10,2) NOT NULL CHECK (service_cost >= 0),
  number_of_operations integer NOT NULL CHECK (number_of_operations > 0),
  number_of_units integer NOT NULL CHECK (number_of_units > 0),
  total_cost numeric(10,2) NOT NULL CHECK (total_cost >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read receipt items"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create receipt items"
  ON service_receipt_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM service_receipts
    WHERE service_receipts.id = receipt_id
    AND service_receipts.created_by = auth.uid()
  ));

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_receipts_created_by ON service_receipts(created_by);
CREATE INDEX IF NOT EXISTS idx_service_receipts_status ON service_receipts(status);
CREATE INDEX IF NOT EXISTS idx_service_receipts_payment_status ON service_receipts(payment_status);
CREATE INDEX IF NOT EXISTS idx_service_receipts_serial_number ON service_receipts(serial_number);
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_receipt_id ON service_receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON service_providers
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();