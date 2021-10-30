--! Previous: sha1:6112bca18db9e35616eae5e69ba63022852fcdfc
--! Hash: sha1:ba307e92ad7c0240606369b120d72845f0b2d217
--! Message: create-refresh-tokens

-- Create refresh_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS refresh_tokens;

-- Create table
CREATE TABLE refresh_tokens (
    id              SERIAL PRIMARY KEY,
    access_token    TEXT NOT NULL,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX refresh_tokens_token_key ON refresh_tokens (token);

-- Create foreign key constraint
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Go back and fix access_tokens constraint
ALTER TABLE access_tokens DROP CONSTRAINT IF EXISTS access_tokens_user_id_fkey;
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
