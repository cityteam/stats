--! Previous: sha1:c6b398b4ba13a8bb86387ad079e66497bfc37d37
--! Hash: sha1:e0b31f13d939aa397e1f3af06063d822c41119d7
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
