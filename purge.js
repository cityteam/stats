// purge ---------------------------------------------------------------------

// Use application server to purge expired access and refresh tokens
// (either local or remote).

// Usage (from project root directory): node purge.js [--remote]

// This command assumes you have the following environment variables defined
// in the ".env" file corresponding to your runtime environment:
// DATABASE_TOKEN                       Configured token for database actions
// LOCAL_URL                            URL of running local server application
// REMOTE_URL                           URL of running remote server application
//                                      (only required if you use --remote)

// External Modules ----------------------------------------------------------

const axios = require("axios");
require("custom-env").env(true);
const argv = require("yargs/yargs")(process.argv.slice(2))
    .usage("$0 [--remote]")
    .describe("remote", "Purge on the remote version of this database [local database]")
    .argv;

// Public Script ------------------------------------------------------------

// Gather configuration parameters
const databaseToken = process.env.DATABASE_TOKEN;
const remote = argv.remote ? true : false;
const url = remote ? process.env.REMOTE_URL : process.env.LOCAL_URL;
console.log("args", {
    remote: remote,
    url: url,
});

// Validate configuration parameters
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
    client.delete("/api/database/purge", { headers })
        .then(response => {
            console.log((remote ? "Remote" : "Local") + " tokens purged", response.data);
        });
} catch (error) {
    console.error(`Error '${error.message}' calling server`, error);
    process.exit(2);
}
