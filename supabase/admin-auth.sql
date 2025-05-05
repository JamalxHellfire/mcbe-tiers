
-- This SQL function would normally be executed in Supabase SQL editor
-- It creates a secure way to verify admin PINs without exposing the hashed values

CREATE OR REPLACE FUNCTION verify_admin_pin(pin_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pin_matched BOOLEAN;
BEGIN
  -- Compare the provided PIN with stored hashed PINs
  -- In a real app, you'd use pgcrypto to hash the input and compare
  SELECT EXISTS (
    SELECT 1 FROM admins
    -- In production, use password_verify or similar
    WHERE hashed_pin = pin_to_check
  ) INTO pin_matched;
  
  RETURN pin_matched;
END;
$$;
