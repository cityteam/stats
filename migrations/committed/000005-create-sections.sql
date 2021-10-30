--! Previous: sha1:17d75ff9b5670333e88983b4aa8672fe08f38cfe
--! Hash: sha1:9acd3c09d1b12fb16353ef940d4caa662d7c7b9a
--! Message: create-sections

-- Create sections table

-- Undo if rerunning
DROP TABLE IF EXISTS sections;

-- Create table
CREATE TABLE sections (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN  NOT NULL DEFAULT TRUE,
    facility_id     INTEGER  NOT NULL,
    notes           TEXT     NULL,
    ordinal         INTEGER  NOT NULL,
    scope           TEXT     NOT NULL DEFAULT 'regular',
    slug            TEXT     NOT NULL,
    title           TEXT     NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX sections_facility_id_ordinal
    ON sections (facility_id, ordinal);

-- Create foreign key constraint
ALTER TABLE sections ADD CONSTRAINT sections_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id)
    ON UPDATE CASCADE ON DELETE CASCADE;
