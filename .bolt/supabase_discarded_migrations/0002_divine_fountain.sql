/*
  # Add service provider fields to service receipts

  1. Changes
    - Add service_provider_name and service_provider_code columns to service_receipts table
    - Make the fields required
    - Update existing RLS policies to include new fields

  2. Security
    - No changes to RLS policies needed as the existing policies cover the new columns
*/

-- Add new columns to service_receipts
ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS service_provider_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS service_provider_code text NOT NULL DEFAULT '';

-- Remove the default values after adding the columns
ALTER TABLE service_receipts 
ALTER COLUMN service_provider_name DROP DEFAULT,
ALTER COLUMN service_provider_code DROP DEFAULT;