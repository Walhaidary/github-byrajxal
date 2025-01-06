/*
  # Service Receipts Table Setup
  
  1. New Tables
    - Create service_receipts table if it doesn't exist
  
  2. Changes
    - Add total_cost_m column
*/

-- First create the service_receipts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_receipts') THEN
        CREATE TABLE service_receipts (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            serial_number text NOT NULL,
            warehouse_number text NOT NULL,
            service_provider_name text NOT NULL,
            service_provider_code text NOT NULL,
            wbs text NOT NULL,
            service_date date NOT NULL,
            storekeeper_name text NOT NULL,
            status text NOT NULL DEFAULT 'pending',
            payment_status text NOT NULL DEFAULT 'pending',
            created_by uuid NOT NULL REFERENCES auth.users(id),
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
            CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid'))
        );

        -- Enable RLS
        ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Now safely add the new column
ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS total_cost_m numeric(10,2);