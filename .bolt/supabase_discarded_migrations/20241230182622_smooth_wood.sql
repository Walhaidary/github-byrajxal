/*
  # Add manual total cost column
  
  1. Changes
    - Add total_cost_m column to service_receipts table
*/

ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS total_cost_m numeric(10,2);