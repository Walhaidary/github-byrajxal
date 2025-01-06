/*
  # Create Services Table and Policies

  1. New Tables
    - services
      - id (uuid, primary key)
      - name (text, required)
      - description (text, optional)
      - price (numeric, required)
      - category (text, optional)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for viewing and creating services
    - Add trigger for updating timestamps
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "services_select_policy" ON services;
    DROP POLICY IF EXISTS "services_insert_policy" ON services;
    
    -- Create new policies with unique names
    CREATE POLICY "services_select_policy"
    ON services FOR SELECT
    TO authenticated
    USING (true);

    CREATE POLICY "services_insert_policy"
    ON services FOR INSERT
    TO authenticated
    WITH CHECK (true);
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger with unique name
DROP TRIGGER IF EXISTS services_set_updated_at ON services;
CREATE TRIGGER services_set_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION services_updated_at();