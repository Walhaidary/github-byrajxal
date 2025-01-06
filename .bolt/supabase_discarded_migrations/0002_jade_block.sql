/*
  # Service Receipts Schema

  1. Tables
    - service_receipts: Main receipt table
    - service_receipt_items: Line items for each receipt
  
  2. Changes
    - Create service_receipts table with all required fields
    - Create service_receipt_items table with proper columns and constraints
    - Add appropriate indexes and foreign keys
    - Enable RLS and add security policies
*/

-- Create service_receipts table
CREATE TABLE IF NOT EXISTS service_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text NOT NULL UNIQUE,
  warehouse_number text NOT NULL,
  service_provider_name text NOT NULL,
  service_provider_code text NOT NULL,
  wbs text NOT NULL,
  service_date date NOT NULL,
  storekeeper_name text NOT NULL,
  total_cost decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES auth.users(id),
  approved_by_name text,
  approved_at timestamptz
);

-- Create service_receipt_items table
CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  service_name text NOT NULL,
  service_cost decimal(10,2) NOT NULL,
  operations integer NOT NULL DEFAULT 1,
  units integer NOT NULL DEFAULT 1,
  total_cost decimal(10,2) GENERATED ALWAYS AS (service_cost * operations * units) STORED,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Service Receipts Policies
CREATE POLICY "Users can view their own receipts"
  ON service_receipts
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create receipts"
  ON service_receipts
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Supervisors can view all receipts"
  ON service_receipts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level IN ('supervisor', 'admin')
    )
  );

CREATE POLICY "Supervisors can approve receipts"
  ON service_receipts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level IN ('supervisor', 'admin')
    )
  )
  WITH CHECK (status = 'approved');

-- Service Receipt Items Policies
CREATE POLICY "Users can view their own receipt items"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create receipt items"
  ON service_receipt_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );

CREATE POLICY "Supervisors can view all receipt items"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_level IN ('supervisor', 'admin')
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_receipts_created_by ON service_receipts(created_by);
CREATE INDEX IF NOT EXISTS idx_service_receipts_status ON service_receipts(status);
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_receipt_id ON service_receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_service_id ON service_receipt_items(service_id);