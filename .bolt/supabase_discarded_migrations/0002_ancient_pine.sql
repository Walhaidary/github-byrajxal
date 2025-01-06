/*
  # Add payment tracking to service receipts

  1. Changes
    - Add payment_status column to track payment state (pending/paid)
    - Add payment_date column to record when payment was made
    - Add paid_by column to track who processed the payment
  
  2. Security
    - Maintain existing RLS policies
    - Reference auth.users for paid_by foreign key
*/

-- Add payment tracking columns
ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
ADD COLUMN IF NOT EXISTS payment_date timestamptz,
ADD COLUMN IF NOT EXISTS paid_by uuid REFERENCES auth.users(id);

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_service_receipts_payment_status ON service_receipts(payment_status);

-- Update existing rows to have default payment status
UPDATE service_receipts 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;