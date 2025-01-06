/*
  # Add service provider contact information
  
  1. Changes
    - Add service_provider_email and service_provider_phone columns to service_receipts table
    
  2. Notes
    - Both fields are optional (nullable)
    - No data migration needed as these are new optional fields
*/

DO $$ 
BEGIN
  -- Add service_provider_email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' 
    AND column_name = 'service_provider_email'
  ) THEN
    ALTER TABLE service_receipts 
    ADD COLUMN service_provider_email text;
  END IF;

  -- Add service_provider_phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' 
    AND column_name = 'service_provider_phone'
  ) THEN
    ALTER TABLE service_receipts 
    ADD COLUMN service_provider_phone text;
  END IF;
END $$;