--! Previous: sha1:ba307e92ad7c0240606369b120d72845f0b2d217
--! Hash: sha1:17d75ff9b5670333e88983b4aa8672fe08f38cfe
--! Message: create-facilities

-- Create facilities table and seed initial data

-- Undo if rerunning
DROP TABLE IF EXISTS facilities;

-- Create table
CREATE TABLE facilities (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    address1        TEXT,
    address2        TEXT,
    city            TEXT,
    email           TEXT,
    name            TEXT NOT NULL,
    phone           TEXT,
    scope           TEXT NOT NULL,
    state           TEXT,
    zipCode         TEXT
);

-- Create unique facilities
CREATE UNIQUE INDEX facilities_name_key ON facilities (name);
CREATE UNIQUE INDEX facilities_scope_key ON facilities (scope);

-- Seed initial data
INSERT INTO facilities (address1, address2, city, email, name, phone, scope, state, zipCode) VALUES
('634 Sproul Street', null, 'Chester', 'chester@cityteam.org', 'Chester', '610-872-6865', 'phi', 'PA', '19013'),
('722 Washington Street', null, 'Oakland', 'oakland@cityteam.org', 'Oakland', '510-452-3758', 'oak', 'CA', '94607'),
('526 SE Grand Ave.', null, 'Portland', 'portland@cityteam.org', 'Portland', '503-231-9334', 'pdx', 'OR', '97214'),
('164 6th Street', null, 'San Francisco', 'sanfrancisco@cityteam.org', 'San Francisco', '415-861-8688', 'sfo', 'CA', '94103'),
('2306 Zanker Road', null, 'San Jose', 'sanjose@cityteam.org', 'San Jose', '408-232-5600', 'sjc', 'CA', '95131'),
(null, null, null, null, 'Test Facility', null, 'test', null, null);
