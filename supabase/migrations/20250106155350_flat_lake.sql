/*
  # Update tokens system to use USD
  
  1. Changes
    - Modify user_tokens table to store USD amounts
    - Update default amount to $1 for new users
    - Remove token deduction function (will be handled by server)
*/

-- Modify user_tokens table to use decimal for USD amounts
ALTER TABLE user_tokens
  ALTER COLUMN tokens TYPE decimal(10,2),
  ALTER COLUMN tokens SET DEFAULT 1.00;

-- Drop the deduct_tokens function since it will be handled by the server
DROP FUNCTION IF EXISTS deduct_tokens(uuid, integer);

-- Update the trigger function for new users
CREATE OR REPLACE FUNCTION handle_new_user_tokens()
RETURNS trigger AS $$
BEGIN
  -- Check if tokens record already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_tokens WHERE user_id = NEW.id
  ) THEN
    -- Create new tokens record with $1.00
    INSERT INTO public.user_tokens (user_id, tokens)
    VALUES (NEW.id, 1.00);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user_tokens: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
