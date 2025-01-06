/*
  # Add helper field column
  
  1. Changes
    - Add helper_field column to service_receipts table
*/

ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS helper_field numeric(10,2);