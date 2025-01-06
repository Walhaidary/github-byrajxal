-- Drop existing trigger and function
DROP TRIGGER IF EXISTS sync_total_cost_trigger ON service_receipts;
DROP FUNCTION IF EXISTS sync_total_cost_with_helper();

-- Remove the columns
ALTER TABLE service_receipts 
DROP COLUMN IF EXISTS total_cost,
DROP COLUMN IF EXISTS total_cost_m;