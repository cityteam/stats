--! Previous: sha1:e0b31f13d939aa397e1f3af06063d822c41119d7
--! Hash: sha1:77b2c2fb43f597d94dbb3791bcd6ec7d5589aa80
--! Message: allow-details-value-null

-- Allow nulls in detail.values
ALTER TABLE details ALTER COLUMN value DROP NOT NULL;
