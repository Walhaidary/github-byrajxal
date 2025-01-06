-- Drop the trigger first since it references the column
DROP TRIGGER IF EXISTS sync_total_cost_trigger ON service_receipts;
DROP FUNCTION IF EXISTS sync_total_cost_with_helper();

-- Remove the total_cost column
ALTER TABLE service_receipts 
DROP COLUMN IF EXISTS total_cost;