/*
  # Add tokens functionality
  
  1. New Tables
    - `user_tokens`
      - `user_id` (uuid, references auth.users)
      - `tokens` (integer, default 100)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on user_tokens table
    - Add policies for users to read their own tokens
    - Add policy for system to update tokens
*/

-- Create tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  tokens integer DEFAULT 100 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tokens"
  ON user_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update tokens"
  ON user_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user token creation
CREATE OR REPLACE FUNCTION handle_new_user_tokens()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_tokens (user_id, tokens)
  VALUES (new.id, 100);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user token creation
CREATE OR REPLACE TRIGGER on_auth_user_created_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_tokens();

-- Function to deduct tokens
CREATE OR REPLACE FUNCTION deduct_tokens(
  user_id uuid,
  amount integer
) RETURNS boolean AS $$
DECLARE
  current_tokens integer;
BEGIN
  -- Get current tokens
  SELECT tokens INTO current_tokens
  FROM user_tokens
  WHERE user_id = deduct_tokens.user_id
  FOR UPDATE;

  -- Check if enough tokens
  IF current_tokens >= amount THEN
    -- Update tokens
    UPDATE user_tokens
    SET tokens = tokens - amount,
        updated_at = now()
    WHERE user_id = deduct_tokens.user_id;
    
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
