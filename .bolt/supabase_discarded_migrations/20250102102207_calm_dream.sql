/*
  # Add provider-specific pricing support

  1. New Tables
    - `service_provider_prices`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services)
      - `provider_id` (uuid, references service_providers)
      - `price` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on new table
    - Add policies for viewing and managing prices
*/

-- Create service provider prices table
CREATE TABLE IF NOT EXISTS service_provider_prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE,
    provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
    price numeric(15,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(service_id, provider_id)
);

-- Enable RLS
ALTER TABLE service_provider_prices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view service provider prices"
    ON service_provider_prices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can manage service provider prices"
    ON service_provider_prices FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create updated_at trigger
CREATE TRIGGER update_service_provider_prices_updated_at
    BEFORE UPDATE ON service_provider_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();