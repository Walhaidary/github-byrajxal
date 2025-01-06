/*
  # Add update tracking columns to service_receipts table

  1. Changes
    - Add `status` column to track receipt approval status
    - Add `updated_by` column to track who approved/updated the receipt
    - Add `updated_by_name` column to store the user's email
    - Add `updated_at` column to track when the receipt was last updated
*/

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'status'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN status text DEFAULT 'pending';
  END IF;
END $$;

-- Add updated_by column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN updated_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add updated_by_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'updated_by_name'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN updated_by_name text;
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_receipts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE service_receipts ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;