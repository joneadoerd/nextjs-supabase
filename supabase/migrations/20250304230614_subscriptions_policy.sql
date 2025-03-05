CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    phone_number TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE subscriptions_status AS ENUM ('active', 'expired');

CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES customers(user_id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT now(),
    end_date DATE,
    subscriptions_status subscriptions_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);


-- Ensure user_id in customers is unique
ALTER TABLE customers
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Add the foreign key constraint to subscriptions
ALTER TABLE subscriptions
ADD CONSTRAINT fk_subscriptions_user
FOREIGN KEY (user_id) REFERENCES customers(user_id) ON DELETE CASCADE;


CREATE POLICY "Admins can update subscriptions"
ON subscriptions
FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM user_roles  WHERE role = 'admin')
);

CREATE POLICY "Admins can delete subscriptions"
ON subscriptions
FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM user_roles WHERE role = 'admin')
);

CREATE POLICY "Admins can create subscriptions"
ON subscriptions
FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
