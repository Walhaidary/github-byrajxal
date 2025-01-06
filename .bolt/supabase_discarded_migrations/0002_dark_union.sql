/*
  # Service Receipt Tables

  1. New Tables
    - `service_receipts`
      - `id` (uuid, primary key)
      - `serial_number` (text, unique)
      - `warehouse_number` (text)
      - `wbs` (text)
      - `service_date` (date)
      - `storekeeper_name` (text)
      - `total_cost` (numeric)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `service_receipt_items`
      - `id` (uuid, primary key)
      - `receipt_id` (uuid, references service_receipts)
      - `service_name` (text)
      - `service_id` (text)
      - `service_cost` (numeric)
      - `number_of_operations` (integer)
      - `number_of_units` (integer)
      - `total_cost` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own receipts
    - Add policies for supervisors to view all receipts
*/

DO $$ BEGIN
  -- Create service_receipts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS service_receipts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      serial_number text UNIQUE NOT NULL,
      warehouse_number text NOT NULL,
      wbs text NOT NULL,
      service_date date NOT NULL,
      storekeeper_name text NOT NULL,
      total_cost numeric NOT NULL DEFAULT 0,
      created_by uuid REFERENCES auth.users(id) NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
  );

  -- Create service_receipt_items table if it doesn't exist
  CREATE TABLE IF NOT EXISTS service_receipt_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      receipt_id uuid REFERENCES service_receipts(id) ON DELETE CASCADE NOT NULL,
      service_name text NOT NULL,
      service_id text NOT NULL,
      service_cost numeric NOT NULL,
      number_of_operations integer NOT NULL DEFAULT 1,
      number_of_units integer NOT NULL DEFAULT 1,
      total_cost numeric NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE service_receipts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE service_receipt_items ENABLE ROW LEVEL SECURITY;

  -- Create policies for service_receipts if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can create their own receipts') THEN
    CREATE POLICY "Users can create their own receipts"
        ON service_receipts
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can view their own receipts') THEN
    CREATE POLICY "Users can view their own receipts"
        ON service_receipts
        FOR SELECT
        TO authenticated
        USING (
            auth.uid() = created_by OR
            EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid()
                AND role_level IN ('supervisor', 'admin')
            )
        );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can update their own receipts') THEN
    CREATE POLICY "Users can update their own receipts"
        ON service_receipts
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = created_by)
        WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipts' AND policyname = 'Users can delete their own receipts') THEN
    CREATE POLICY "Users can delete their own receipts"
        ON service_receipts
        FOR DELETE
        TO authenticated
        USING (auth.uid() = created_by);
  END IF;

  -- Create policies for service_receipt_items if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipt_items' AND policyname = 'Users can manage items of their own receipts') THEN
    CREATE POLICY "Users can manage items of their own receipts"
        ON service_receipt_items
        FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM service_receipts
                WHERE id = receipt_id
                AND created_by = auth.uid()
            )
        );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_receipt_items' AND policyname = 'Supervisors can view all receipt items') THEN
    CREATE POLICY "Supervisors can view all receipt items"
        ON service_receipt_items
        FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid()
                AND role_level IN ('supervisor', 'admin')
            )
        );
  END IF;

  -- Create indexes for better performance if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_receipts_created_by') THEN
    CREATE INDEX idx_service_receipts_created_by ON service_receipts(created_by);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_receipts_serial_number') THEN
    CREATE INDEX idx_service_receipts_serial_number ON service_receipts(serial_number);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_receipt_items_receipt_id') THEN
    CREATE INDEX idx_service_receipt_items_receipt_id ON service_receipt_items(receipt_id);
  END IF;

  -- Create function to update updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;

  -- Create triggers if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_service_receipts_updated_at') THEN
    CREATE TRIGGER update_service_receipts_updated_at
        BEFORE UPDATE ON service_receipts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_service_receipt_items_updated_at') THEN
    CREATE TRIGGER update_service_receipt_items_updated_at
        BEFORE UPDATE ON service_receipt_items
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;