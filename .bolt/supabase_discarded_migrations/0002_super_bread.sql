/*
  # Add approval tracking for service receipts
  
  1. Changes
    - Add approved_by column to store the user ID who approved the receipt
    - Add approved_by_name column to store the approver's name/email
    - Add approved_at column to store the approval timestamp
  
  2. Security
    - Maintain existing RLS policies
    - Add foreign key reference to auth.users for approved_by
*/

-- Add approval tracking columns
ALTER TABLE service_receipts 
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_by_name text,
ADD COLUMN IF NOT EXISTS approved_at timestamptz;