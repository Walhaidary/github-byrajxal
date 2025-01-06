/*
  # Add provider columns to services table
  
  1. Changes
    - Add provider_id column (uuid, references service_providers)
    - Add provider_name column (text)
  
  2. Notes
    - Uses IF NOT EXISTS to ensure idempotency
    - References service_providers table for foreign key
*/

-- Add provider columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'provider_id'
  ) THEN
    ALTER TABLE services ADD COLUMN provider_id uuid REFERENCES service_providers(id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'provider_name'
  ) THEN
    ALTER TABLE services ADD COLUMN provider_name text;
  END IF;
END $$;