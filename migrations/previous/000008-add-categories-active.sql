--! Previous: sha1:ad84f014748af13397dfa92dba6f3d7cc25dad94
--! Hash: sha1:5e4d90155d034bbc4da3f629ea162aec5a08dd2b
--! Message: add-categories-active

-- Add active to categories

ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
