/*
  # Sync total_cost with helper_field

  1. Changes
    - Creates a trigger to automatically sync total_cost with helper_field
    - Ensures data consistency between the two columns
    - Updates existing records to sync values

  2. Details
    - Trigger fires BEFORE INSERT OR UPDATE
    - Copies helper_field value to total_cost
    - Handles NULL values gracefully
*/

-- First, update existing records to ensure consistency
UPDATE service_receipts 
SET total_cost = helper_field 
WHERE helper_field IS NOT NULL;

-- Create trigger function
CREATE OR REPLACE FUNCTION sync_total_cost_with_helper()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost = NEW.helper_field;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_total_cost_trigger ON service_receipts;

CREATE TRIGGER sync_total_cost_trigger
  BEFORE INSERT OR UPDATE OF helper_field
  ON service_receipts
  FOR EACH ROW
  EXECUTE FUNCTION sync_total_cost_with_helper();