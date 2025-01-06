/*
  # Create service receipt items table

  1. New Tables
    - `service_receipt_items`
      - `id` (uuid, primary key)
      - `receipt_id` (uuid, foreign key)
      - `service_id` (text)
      - `service_name` (text)
      - `service_cost` (numeric)
      - `operations` (integer)
      - `units` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `service_receipt_items` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS service_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES service_receipts(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  service_name text NOT NULL,
  service_cost numeric NOT NULL DEFAULT 0,
  operations integer NOT NULL DEFAULT 1,
  units integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own service receipt items"
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

CREATE POLICY "Users can create service receipt items"
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