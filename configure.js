// configure -----------------------------------------------------------------

// Configure the database schema for the specified database, based on the
// committed migrations in this project.  It assumes you are starting from
// an empty (generally, completely new) database, such as would be the case
// in a GitHub Action to configure a database instance for CI testing.

// WARNING:  This script will potentially destroy information in the database!
// It should only be used on a test database instance.

// Usage (from project root directory:  node configure.js [--force]

// Options:
//   --force        Force execution even if the database name is "stats"

// Environment Variables:
//   DATABASE_URL   Postgres connection URL for the database to be configured.

// Requirements:  The Postgres command line tools (particularly psql) must be
// available on the execution PATH where this script is run.

// External Modules ----------------------------------------------------------

const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");
const argv = require("yargs/yargs")(process.argv.slice(2))
    .usage("$0 [--force] {DATABASE_URL}")
    .describe("force", "Force execution even if the database name is 'stats'")
    .argv;

// Private Objects -----------------------------------------------------------

const MIGRATIONS_DIRECTORY = "migrations/committed";

// Public Script -------------------------------------------------------------

// ----- Gather configuration parameters -------------------------------------
const databaseUrl = process.env.DATABASE_URL;
const force = argv.force ? true : false;

// ----- Validate configuration parameters -----------------------------------

if (!databaseUrl) {
    console.error("Error:  Missing DATABASE_URL in environment");
    process.exit(1);
}
if (databaseUrl.endsWith("/stats") && !force) {
    console.error("Error:  Cannot configure production database without --force option");
    process.exit(1);
}
if (!fs.existsSync(MIGRATIONS_DIRECTORY)) {
    console.error(`Error:  Directory '${MIGRATIONS_DIRECTORY}' does not exist`);
    process.exit(2);
}
console.log(`--- Configuring database '${databaseUrl}'`);

// ----- Read names of committed migrations ----------------------------------

const migrations = [];
fs.readdirSync(MIGRATIONS_DIRECTORY).map(filename => {
    if (filename.startsWith("0") && filename.endsWith(".sql")) {
        migrations.push(path.join(MIGRATIONS_DIRECTORY, filename));
    }
});
migrations.sort();

// ----- Perform the requested migrations ------------------------------------

try {
    migrations.forEach(migration => {
        console.log(`--- Running migration '${migration}'`);
        const command = `psql ${databaseUrl} < ${migration}`;
        const stdout = execSync(command);
        console.log(stdout.toString());
    });
} catch (error) {
    console.error("ERROR:", error);
    process.exit(3);
}
