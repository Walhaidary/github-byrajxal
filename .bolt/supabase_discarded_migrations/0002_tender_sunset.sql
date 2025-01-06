/*
  # Service Management Schema
  
  1. New Tables
    - services: Stores service configurations
      - id (uuid, primary key)
      - name (text)
      - description (text, optional)
      - price (numeric)
      - category (text, optional)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - service_providers: Stores service provider information
      - id (uuid, primary key)
      - company_name (text)
      - contact_name (text, optional)
      - email (text)
      - phone (text, optional)
      - vendor_number (text)
      - service_categories (text array)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - service_receipts: Stores service receipt records
      - id (uuid, primary key)
      - serial_number (text)
      - warehouse_number (text)
      - service_provider_code (text)
      - service_provider_name (text)
      - wbs (text)
      - service_date (date)
      - storekeeper_name (text)
      - total_cost (numeric)
      - status (text)
      - created_by (uuid)
      - created_at (timestamp)
      - approved_by (uuid, optional)
      - approved_at (timestamp, optional)
    
    - service_receipt_items: Stores individual items in service receipts
      - id (uuid, primary key)
      - receipt_id (uuid)
      - service_id (uuid)
      - service_name (text)
      - service_cost (numeric)
      - number_of_operations (integer)
      - number_of_units (integer)
      - total_cost (numeric)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_providers table
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

-- Create service_receipts table
CREATE TABLE IF NOT EXISTS service_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text NOT NULL UNIQUE,
  warehouse_number text NOT NULL,
  service_provider_code text NOT NULL,
  service_provider_name text NOT NULL,
  wbs text NOT NULL,
  service_date date NOT NULL,
  storekeeper_name text NOT NULL,
  total_cost numeric NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz
);

-- Create service_receipt_items table
CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  service_name text NOT NULL,
  service_cost numeric NOT NULL CHECK (service_cost >= 0),
  number_of_operations integer NOT NULL CHECK (number_of_operations > 0),
  number_of_units integer NOT NULL CHECK (number_of_units > 0),
  total_cost numeric NOT NULL CHECK (total_cost >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Everyone can read service providers"
  ON service_providers FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can read their own receipts"
  ON service_receipts FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create receipts"
  ON service_receipts FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can read receipt items"
  ON service_receipt_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create receipt items"
  ON service_receipt_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );