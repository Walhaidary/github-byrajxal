/*
  # Fix Service Receipts Schema

  1. Changes
    - Remove total_cost field
    - Ensure helper_field exists with proper type
    - Add missing timestamps
    - Add proper constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop any existing triggers
DROP TRIGGER IF EXISTS sync_total_cost_trigger ON service_receipts;
DROP FUNCTION IF EXISTS sync_total_cost_with_helper();

-- Drop existing policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own receipts" ON service_receipts;
    DROP POLICY IF EXISTS "Users can create receipts" ON service_receipts;
    DROP POLICY IF EXISTS "Users can view their receipt items" ON service_receipt_items;
    DROP POLICY IF EXISTS "Users can create receipt items" ON service_receipt_items;
EXCEPTION
    WHEN undefined_table THEN
        NULL;
END $$;

-- Ensure service_receipts table has correct structure
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
            helper_field numeric(15,2) NOT NULL DEFAULT 0,
            status text NOT NULL DEFAULT 'pending',
            payment_status text NOT NULL DEFAULT 'pending',
            created_by uuid NOT NULL REFERENCES auth.users(id),
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            approved_by uuid REFERENCES auth.users(id),
            approved_by_name text,
            approved_at timestamptz,
            paid_by uuid REFERENCES auth.users(id),
            payment_date timestamptz,
            CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
            CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid'))
        );
    END IF;
END $$;

-- Ensure service_receipt_items table has correct structure
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_receipt_items') THEN
        CREATE TABLE service_receipt_items (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            receipt_id uuid NOT NULL REFERENCES service_receipts(id) ON DELETE CASCADE,
            service_id text NOT NULL,
            service_name text NOT NULL,
            service_cost numeric(15,2) NOT NULL,
            number_of_operations integer NOT NULL DEFAULT 1,
            number_of_units integer NOT NULL DEFAULT 1,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );
    END IF;
END $$;

-- Enable RLS
ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can view their own receipts') THEN
        CREATE POLICY "Users can view their own receipts"
            ON service_receipts
            FOR SELECT
            TO authenticated
            USING (created_by = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can create receipts') THEN
        CREATE POLICY "Users can create receipts"
            ON service_receipts
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() IS NOT NULL);
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'service_receipt_items' AND policyname = 'Users can view their receipt items') THEN
        CREATE POLICY "Users can view their receipt items"
            ON service_receipt_items
            FOR SELECT
            TO authenticated
            USING (
                receipt_id IN (
                    SELECT id FROM service_receipts 
                    WHERE created_by = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'service_receipt_items' AND policyname = 'Users can create receipt items') THEN
        CREATE POLICY "Users can create receipt items"
            ON service_receipt_items
            FOR INSERT
            TO authenticated
            WITH CHECK (
                receipt_id IN (
                    SELECT id FROM service_receipts 
                    WHERE created_by = auth.uid()
                )
            );
    END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_service_receipts_updated_at ON service_receipts;
CREATE TRIGGER update_service_receipts_updated_at
    BEFORE UPDATE ON service_receipts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_service_receipt_items_updated_at ON service_receipt_items;
CREATE TRIGGER update_service_receipt_items_updated_at
    BEFORE UPDATE ON service_receipt_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();