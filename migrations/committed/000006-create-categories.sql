--! Previous: sha1:4c166e3eea9765899097740fde16c5cae9ff3e5e
--! Hash: sha1:ba4956a9942ca0354519919ec67a4e3d7a7139f4
--! Message: create-categories

-- Create categories table

-- Undo if rerunning
DROP TABLE IF EXISTS categories;

-- Create table
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    description     TEXT NULL,
    facility_id     INTEGER NOT NULL,
    notes           TEXT NULL,
    ordinal         INTEGER NOT NULL,
    service         TEXT NOT NULL,
    scope           TEXT NULL,
    slug            TEXT NULL,
    type            TEXT NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX categories_facility_id_ordinal
    ON categories (facility_id, ordinal);
CREATE UNIQUE INDEX categories_facility_id_scope
    ON categories (facility_id, scope);

-- Create foreign key constraints
ALTER TABLE categories ADD CONSTRAINT categories_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id)
    ON UPDATE CASCADE ON DELETE CASCADE;
