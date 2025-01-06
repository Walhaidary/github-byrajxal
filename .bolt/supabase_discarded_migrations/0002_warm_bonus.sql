/*
  # Add service receipt items table

  1. New Tables
    - `service_receipt_items`
      - `id` (uuid, primary key)
      - `receipt_id` (uuid, references service_receipts)
      - `service_id` (uuid, references services)
      - `service_name` (text)
      - `cost` (numeric)
      - `operations` (integer)
      - `units` (integer)
      - `total` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `service_receipt_items` table
    - Add policies for read access
*/

-- Create service receipt items table
CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  service_name text NOT NULL,
  cost numeric NOT NULL,
  operations integer NOT NULL DEFAULT 1,
  units integer NOT NULL DEFAULT 1,
  total numeric GENERATED ALWAYS AS (cost * operations * units) STORED,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_cost CHECK (cost >= 0),
  CONSTRAINT positive_operations CHECK (operations > 0),
  CONSTRAINT positive_units CHECK (units > 0)
);

-- Enable RLS
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view receipt items they have access to"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_receipts sr
      WHERE sr.id = receipt_id
      AND (
        sr.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_id = auth.uid()
          AND role_level IN ('supervisor', 'admin')
        )
      )
    )
  );

-- Create index for better query performance
CREATE INDEX idx_service_receipt_items_receipt_id ON service_receipt_items(receipt_id);