/*
  # Add service receipt items table

  1. New Tables
    - `service_receipt_items`
      - `id` (uuid, primary key)
      - `receipt_id` (uuid, foreign key to service_receipts)
      - `service_id` (uuid, foreign key to services)
      - `service_name` (text)
      - `cost` (numeric)
      - `operations` (integer)
      - `units` (integer)
      - `total` (numeric)
      - `created_at` (timestamptz)

  2. Changes
    - Add approval tracking columns to service_receipts table
    - Add foreign key constraints and indexes
    
  3. Security
    - Enable RLS on service_receipt_items table
    - Add policies for authenticated users
*/

-- Create service_receipt_items table
CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  service_name text NOT NULL,
  cost numeric NOT NULL CHECK (cost >= 0),
  operations integer NOT NULL CHECK (operations > 0),
  units integer NOT NULL CHECK (units > 0),
  total numeric NOT NULL CHECK (total >= 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT service_receipt_items_total_check 
    CHECK (total = cost * operations * units)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_receipt_id 
  ON service_receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_service_id 
  ON service_receipt_items(service_id);

-- Add approval tracking columns to service_receipts if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE service_receipts 
    ADD COLUMN approved_by uuid REFERENCES auth.users(id),
    ADD COLUMN approved_by_name text,
    ADD COLUMN approved_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own service receipt items"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = service_receipt_items.receipt_id
      AND (
        service_receipts.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role_level IN ('supervisor', 'admin')
        )
      )
    )
  );

CREATE POLICY "Users can insert their own service receipt items"
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

-- Create function to update service receipt total
CREATE OR REPLACE FUNCTION update_service_receipt_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE service_receipts
  SET total_cost = (
    SELECT COALESCE(SUM(total), 0)
    FROM service_receipt_items
    WHERE receipt_id = NEW.receipt_id
  )
  WHERE id = NEW.receipt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update service receipt total
DROP TRIGGER IF EXISTS update_receipt_total ON service_receipt_items;
CREATE TRIGGER update_receipt_total
  AFTER INSERT OR UPDATE OR DELETE
  ON service_receipt_items
  FOR EACH ROW
  EXECUTE FUNCTION update_service_receipt_total();