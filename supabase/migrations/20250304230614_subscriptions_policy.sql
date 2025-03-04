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
USING (
  auth.uid() IN (SELECT id FROM user_roles WHERE role = 'admin')
);
