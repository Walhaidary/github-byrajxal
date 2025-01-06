/*
  # Fix service receipt items permissions

  1. Changes
    - Add RLS policy for inserting service receipt items
    - Add RLS policy for updating service receipt items
    - Add RLS policy for deleting service receipt items
    
  2. Security
    - Users can only modify items for receipts they created
    - Maintains data integrity with receipt ownership checks
*/

-- Drop existing policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create receipt items" ON service_receipt_items;
    DROP POLICY IF EXISTS "Users can update receipt items" ON service_receipt_items;
    DROP POLICY IF EXISTS "Users can delete receipt items" ON service_receipt_items;
END $$;

-- Create new policies
CREATE POLICY "Users can create receipt items"
ON service_receipt_items
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM service_receipts
        WHERE id = service_receipt_items.receipt_id
        AND created_by = auth.uid()
    )
);

CREATE POLICY "Users can update receipt items"
ON service_receipt_items
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM service_receipts
        WHERE id = service_receipt_items.receipt_id
        AND created_by = auth.uid()
    )
);

CREATE POLICY "Users can delete receipt items"
ON service_receipt_items
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM service_receipts
        WHERE id = service_receipt_items.receipt_id
        AND created_by = auth.uid()
    )
);