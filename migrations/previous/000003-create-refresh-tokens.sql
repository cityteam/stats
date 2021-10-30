--! Previous: sha1:6112bca18db9e35616eae5e69ba63022852fcdfc
--! Hash: sha1:53432bb48212862eca83ff452fb0cc42c6c6b43b
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
    FOREIGN KEY (user_id) REFERENCES users (id);
