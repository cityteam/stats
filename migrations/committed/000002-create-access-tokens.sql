--! Previous: sha1:383a30f958d7433b9b8861d5ac11f094f13ab977
--! Hash: sha1:6112bca18db9e35616eae5e69ba63022852fcdfc
--! Message: create-access-tokens

-- Create access_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS access_tokens;

-- Create table
CREATE TABLE access_tokens (
    id              SERIAL PRIMARY KEY,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    scope           TEXT NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX access_tokens_token_key ON access_tokens (token);

-- Create foreign key constraint
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id);
