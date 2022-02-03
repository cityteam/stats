// backup --------------------------------------------------------------------

// Use application server to back up the "stats" database (either local or remote).

// Usage (from project root directory):  node backup.js [--remote] [--directory DIRECTORY]

// This command assumes you have the following environment variables defined
// in the ".env" file corresponding to your runtime environment:
// BACKUP_DIRECTORY                     Base directory to store backup files
// DATABASE_NAME                        Short name of database (used to create filename)
// DATABASE_TOKEN                       Configured token for database actions
// LOCAL_URL                            URL of running local server application
// REMOTE_URL                           URL of running remote server application
//                                      (only required if you use --remote)

// External Modules ----------------------------------------------------------

const axios = require("axios");
require("custom-env").env(true);
const fs = require("fs");
const path = require("path");
const argv = require("yargs/yargs")(process.argv.slice(2))
    .usage("$0 [--directory directory] [--remote]")
    .describe("directory", "Absolute path of storage directory [from environment]")
    .describe("remote", "Back up the remote version of this database [local database]")
    .argv;

// Private Functions ---------------------------------------------------------

const leftPad = (input, size) => {
    let output = String(input);
    while (output.length < size) {
        output = "0" + output;
    }
    return output;
}

const timestamp = () => {
    const date = new Date();
    return date.getFullYear()
        + leftPad(date.getMonth() + 1, 2)
        + leftPad(date.getDate(), 2)
        + "-"
        + leftPad(date.getHours(), 2)
        + leftPad(date.getMinutes(), 2)
        + leftPad(date.getSeconds(), 2);
}

// Public Script -------------------------------------------------------------

// Gather configuration parameters
const databaseName = process.env.DATABASE_NAME;
const databaseToken = process.env.DATABASE_TOKEN;
const directoryName = argv.directory ? argv.directory : process.env.BACKUP_DIRECTORY;
const remote = argv.remote ? true : false;
const prefix = remote ? `remote-${process.env.DATABASE_NAME}` : process.env.DATABASE_NAME;
const url = remote ? process.env.REMOTE_URL : process.env.LOCAL_URL;
/*
console.log("args", {
    databaseName: databaseName,
    directoryName: directoryName,
    remote: remote,
    prefix: prefix,
    url: url,
});
*/

// Validate configuration parameters
if (!directoryName) {
    console.error("Error: Missing BACKUP_DIRECTORY in environment and no override with --directory");
    process.exit(1);
}
if (!databaseName) {
    console.error("Error: Missing DATABASE_NAME in environment");
    process.exit(1);
}
if (!databaseToken) {
    console.error("Error: Missing DATABASE_TOKEN in environment");
    process.exit(1);
}
if (!url) {
    console.error("Error: Missing " + (remote ? "REMOTE" : "LOCAL") + "_URL in environment");
    process.exit(1);
}

// Prepare Axios client and send the request
const client = axios.create({
    baseURL: url,
});
const headers = {
    "Authorization": `Bearer ${databaseToken}`
}
try {
    client.post("/api/database/dump", null, { headers })
        .then(response => {
            try {
                const pathName = path.resolve(directoryName, `${prefix}-${timestamp()}.sql`);
                console.log(`Backing up database ${databaseName} to ${pathName}`);
                fs.writeFileSync(pathName, response.data);
            } catch (error) {
                console.error(`Error '${error.message}' writing results`, error);
                process.exit(3);
            }
        });
} catch (error) {
    console.error(`Error '${error.message}' calling server`, error);
    process.exit(2);
}
