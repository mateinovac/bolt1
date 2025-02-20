/*
  # Fix tokens trigger function
  
  1. Changes
    - Update trigger to run after user creation in auth.users
    - Add error handling and logging
    - Ensure idempotency with IF NOT EXISTS check
*/

-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created_tokens ON auth.users;

-- Update the trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user_tokens()
RETURNS trigger AS $$
BEGIN
  -- Check if tokens record already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_tokens WHERE user_id = NEW.id
  ) THEN
    -- Create new tokens record
    INSERT INTO public.user_tokens (user_id, tokens)
    VALUES (NEW.id, 100);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details
    RAISE LOG 'Error in handle_new_user_tokens: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_tokens();

-- Backfill tokens for existing users
DO $$ 
BEGIN
  INSERT INTO public.user_tokens (user_id, tokens)
  SELECT id, 100
  FROM auth.users
  WHERE NOT EXISTS (
    SELECT 1 
    FROM public.user_tokens 
    WHERE user_tokens.user_id = users.id
  );
END $$;
