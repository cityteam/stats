--! Previous: -
--! Hash: sha1:383a30f958d7433b9b8861d5ac11f094f13ab977
--! Message: create-users

-- Create users table

-- Undo if rerunning
DROP TABLE IF EXISTS users;

-- Create table
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    name            TEXT NOT NULL,
    password        TEXT NOT NULL,
    scope           TEXT NOT NULL,
    username        TEXT NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX users_username_key ON users (username);
