/*
  # Add warehouse fields to service receipts

  1. Changes
    - Add warehouse_number column to service_receipts table
    - Add storekeeper_name column to service_receipts table
    - Add NOT NULL constraints to ensure data integrity
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'warehouse_number'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN warehouse_number text NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'storekeeper_name'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN storekeeper_name text NOT NULL;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_receipts_warehouse_number 
  ON service_receipts(warehouse_number);

CREATE INDEX IF NOT EXISTS idx_service_receipts_storekeeper_name 
  ON service_receipts(storekeeper_name);