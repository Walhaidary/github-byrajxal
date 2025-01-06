/*
  # Remove warehouse fields from service receipts

  1. Changes
    - Remove warehouse_number column from service_receipts table
    - Remove storekeeper_name column from service_receipts table
    - Drop associated indexes

  2. Security
    - Maintain existing RLS policies
*/

-- Drop indexes first
DROP INDEX IF EXISTS idx_service_receipts_warehouse_number;
DROP INDEX IF EXISTS idx_service_receipts_storekeeper_name;

-- Remove columns if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'warehouse_number'
  ) THEN
    ALTER TABLE service_receipts DROP COLUMN warehouse_number;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'storekeeper_name'
  ) THEN
    ALTER TABLE service_receipts DROP COLUMN storekeeper_name;
  END IF;
END $$;