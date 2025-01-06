/*
  # Create Service Providers Table
  
  1. New Tables
    - `service_providers`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `contact_name` (text, optional)
      - `email` (text)
      - `phone` (text, optional)
      - `vendor_number` (text)
      - `service_categories` (text array)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for provider access
*/

CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  email text NOT NULL,
  phone text,
  vendor_number text NOT NULL UNIQUE,
  service_categories text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Enable RLS
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active providers"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Only admins can manage providers"
  ON service_providers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON service_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();