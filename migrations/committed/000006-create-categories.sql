--! Previous: sha1:9acd3c09d1b12fb16353ef940d4caa662d7c7b9a
--! Hash: sha1:c6b398b4ba13a8bb86387ad079e66497bfc37d37
--! Message: create-categories

-- Create categories table

-- Undo if rerunning
DROP TABLE IF EXISTS categories;

-- Create table
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    accumulated     BOOLEAN NOT NULL DEFAULT true,
    active          BOOLEAN NOT NULL DEFAULT true,
    description     TEXT NULL,
    notes           TEXT NULL,
    ordinal         INTEGER NOT NULL,
    section_id      INTEGER NOT NULL,
    service         TEXT NOT NULL,
    slug            TEXT NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX categories_section_id_ordinal
    ON categories (section_id, ordinal);

-- Create foreign key constraints
ALTER TABLE categories ADD CONSTRAINT categories_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES sections (id)
    ON UPDATE CASCADE ON DELETE CASCADE;
