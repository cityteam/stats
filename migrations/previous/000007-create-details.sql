--! Previous: sha1:ba4956a9942ca0354519919ec67a4e3d7a7139f4
--! Hash: sha1:ad84f014748af13397dfa92dba6f3d7cc25dad94
--! Message: create-details

-- Create details table

-- Undo if rerunning
DROP TABLE IF EXISTS details;

-- Create table
CREATE TABLE details (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER NOT NULL,
    date            DATE NOT NULL,
    notes           TEXT NULL,
    value           NUMERIC NOT NULL
);

-- Create indexes
CREATE INDEX details_category_id_date
    ON details (category_id, date);

-- Create foreign key constraints
ALTER TABLE details ADD CONSTRAINT details_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE CASCADE;
