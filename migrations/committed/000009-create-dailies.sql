--! Previous: sha1:77b2c2fb43f597d94dbb3791bcd6ec7d5589aa80
--! Hash: sha1:2298b3ddde531b0c596abbc52fa126eed2499059
--! Message: create-dailies

-- Create dailies table

-- Undo if rerunning
DROP TABLE IF EXISTS dailies;

-- Create table
CREATE TABLE dailies (
    -- Number of items in each array must match because they correspond to each other
    category_ids    INTEGER[] NOT NULL,
    category_values NUMERIC[] NULL,
    -- Following fields are the composite primary key
    date            DATE NOT NULL,
    section_id      INTEGER NOT NULL
);

-- Create primary key
ALTER TABLE dailies
    ADD CONSTRAINT dailies_pk PRIMARY KEY (date, section_id);

-- Create foreign key constraints
ALTER TABLE dailies ADD CONSTRAINT dailies_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES sections (id)
    ON UPDATE CASCADE ON DELETE CASCADE;

-- Postgres does not support FK relationship from each category_ids value
