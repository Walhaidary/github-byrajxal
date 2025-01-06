/*
  # Add service receipt items and approval tracking

  1. Changes
    - Add JSONB column `items` to store service receipt line items
    - Add columns for tracking approvals:
      - approved_by: References auth.users
      - approved_by_name: Text field for the approver's name/email
      - approved_at: Timestamp of approval
    - Add trigger to automatically calculate total cost from items
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add items column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'items'
  ) THEN
    ALTER TABLE service_receipts 
    ADD COLUMN items JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add approval tracking columns if they don't exist
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

-- Create function to calculate total cost from items
CREATE OR REPLACE FUNCTION calculate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost := (
    SELECT COALESCE(SUM((item->>'cost')::numeric * (item->>'operations')::numeric * (item->>'units')::numeric), 0)
    FROM jsonb_array_elements(NEW.items) AS item
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger to update total_cost
DROP TRIGGER IF EXISTS update_total_cost ON service_receipts;
CREATE TRIGGER update_total_cost
  BEFORE INSERT OR UPDATE OF items
  ON service_receipts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_cost();