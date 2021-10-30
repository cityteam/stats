--! Previous: sha1:61560fc1fa37d9234de488a7dfc29157849d3e39
--! Hash: sha1:4c166e3eea9765899097740fde16c5cae9ff3e5e
--! Message: fix-fkey-constraints

-- Fix foreign key constraints so far

-- Fix constraint on access_tokens
ALTER TABLE access_tokens DROP CONSTRAINT access_tokens_user_id_fkey;
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;

-- Fix constraint on refresh_tokens
ALTER TABLE refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
