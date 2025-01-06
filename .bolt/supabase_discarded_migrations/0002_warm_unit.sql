/*
  # Add status column to user_roles table

  1. Changes
    - Add status column to user_roles table with type 'active' or 'inactive'
    - Set default value to 'active'
    - Make column non-nullable
    - Add check constraint to ensure valid values

  2. Notes
    - All existing rows will have status set to 'active' by default
*/

-- Create enum type for user status if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add status column to user_roles table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_roles' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_roles 
    ADD COLUMN status user_status NOT NULL DEFAULT 'active';

    -- Add check constraint
    ALTER TABLE user_roles 
    ADD CONSTRAINT user_roles_status_check 
    CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;