/*
  # Add service receipt items schema

  1. Changes
    - Create service_receipt_items table if it doesn't exist
    - Add columns for storing service receipt item details:
      - receipt_id: Reference to parent receipt
      - service_id: Reference to service
      - service_name: Name of the service
      - service_cost: Cost per service unit
      - operations: Number of operations performed
      - units: Number of units serviced
      - total_cost: Total cost for this line item (computed)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create service_receipt_items table if it doesn't exist
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
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own receipts items"
  ON service_receipt_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = service_receipt_items.receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own receipt items"
  ON service_receipt_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_receipts
      WHERE service_receipts.id = service_receipt_items.receipt_id
      AND service_receipts.created_by = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_receipt_id ON service_receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_service_receipt_items_service_id ON service_receipt_items(service_id);