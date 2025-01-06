/*
  # Add helper name column to service receipts

  1. Changes
    - Add helper_name column to service_receipts table
*/

ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS helper_name text;