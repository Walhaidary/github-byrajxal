/*
  # Fix total_cost and helper_field columns with proper precision

  1. Changes
    - Modify both columns to use higher precision
    - Re-create trigger with proper error handling
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS sync_total_cost_trigger ON service_receipts;

-- Modify columns to use higher precision
ALTER TABLE service_receipts 
ALTER COLUMN total_cost TYPE numeric(15,2),
ALTER COLUMN helper_field TYPE numeric(15,2);

-- Create enhanced trigger function
CREATE OR REPLACE FUNCTION sync_total_cost_with_helper()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if helper_field has a value
  IF NEW.helper_field IS NOT NULL THEN
    NEW.total_cost = NEW.helper_field;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger
CREATE TRIGGER sync_total_cost_trigger
  BEFORE INSERT OR UPDATE
  ON service_receipts
  FOR EACH ROW
  EXECUTE FUNCTION sync_total_cost_with_helper();