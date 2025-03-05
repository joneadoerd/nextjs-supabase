CREATE TYPE app_roles AS ENUM ('admin', 'client');

-- Create the user_roles table with RLS enabled
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role app_roles NOT NULL DEFAULT 'client'
) WITH (OIDS=FALSE);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create the policy for self-insert
DO $$ 
BEGIN
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow self-insert' 
) THEN
CREATE POLICY "Allow self-insert" 
ON public.user_roles
FOR INSERT 
WITH CHECK (user_id = auth.uid());
END IF;
END $$;

-- Create the policy for read access based on user_id
DO $$ 
BEGIN
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Enable read for users based on user_id' 
) THEN
CREATE POLICY "Enable read for users based on user_id" 
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
END IF;
END $$;

-- Grant permissions to authenticated users
GRANT INSERT, SELECT ON TABLE public.user_roles TO authenticated;

-- Create the trigger function for user signup
CREATE OR REPLACE FUNCTION public.create_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS create_user_on_signup ON auth.users;

-- Create the trigger for user signup
CREATE TRIGGER create_user_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_on_signup();