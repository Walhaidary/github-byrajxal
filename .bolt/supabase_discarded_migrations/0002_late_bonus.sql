/*
  # Add approve_service permission column

  1. Changes
    - Add approve_service column to user_permissions table
    - Set default value to false
    - Make column non-nullable

  2. Notes
    - All existing rows will have approve_service set to false by default
    - Uses safe migration pattern with existence check
*/

DO $$ 
BEGIN
  -- Add approve_service column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_permissions' 
    AND column_name = 'approve_service'
  ) THEN
    ALTER TABLE user_permissions 
    ADD COLUMN approve_service boolean NOT NULL DEFAULT false;

    -- Add comment for documentation
    COMMENT ON COLUMN user_permissions.approve_service IS 'Permission to approve services';
  END IF;
END $$;