/*
  # Add premium field to profiles

  1. Changes
    - Add `is_premium` boolean field to profiles table with default false
    - Add index on is_premium field for faster queries

  2. Security
    - Maintain existing RLS policies
*/

-- Add is_premium field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- Add index for faster premium status lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);
