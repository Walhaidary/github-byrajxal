/*
  # Add total cost column to service receipt items
  
  1. Changes
    - Add total_cost column to service_receipt_items table
    - Add trigger to automatically calculate total_cost
    
  2. Notes
    - total_cost is calculated as service_cost * number_of_operations * number_of_units
    - Trigger ensures total_cost is always up to date
*/

-- Add total_cost column
ALTER TABLE service_receipt_items
ADD COLUMN IF NOT EXISTS total_cost numeric(15,2) NOT NULL DEFAULT 0;

-- Create trigger function to calculate total_cost
CREATE OR REPLACE FUNCTION calculate_item_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost = NEW.service_cost * NEW.number_of_operations * NEW.number_of_units;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS calculate_total_cost_trigger ON service_receipt_items;
CREATE TRIGGER calculate_total_cost_trigger
  BEFORE INSERT OR UPDATE OF service_cost, number_of_operations, number_of_units
  ON service_receipt_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_item_total_cost();