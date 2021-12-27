# Installation Documentation

This document describes installing this application into an operational
environment.  Many of these tasks will apply to a developer setting up
their own environment as well -- see [Developer Documentation](./DEVELOPER.md)
for the details specific to that scenario.

## Planning

Fundamentally, there are two overall environments that need to be deployed:
* *Database Environment* - where the Postgres database containing the application data runs.
* *Application Environment* - where the server application (which is also where the client application is loaded from) runs.

Both of these environments *could* be installed on the same computer,
and have no problems with connectivity.  If they are installed on different
computers:
* The *Database Environment* must support inbound network connections from the *Application Environment*.
* The *Application Environment* must support outbound network connections to the *Database Environment*, and inbound network connections from user browsers.

You will need to have a user account that allows you to install privileged
applications (typically called an "Administrator" account) to successfully
install the required software.

Users only need a modern web browser (Microsoft Edge, Chrome, Firefox,
Safari etc.), and can operate on either the same machine as one or both
of these environments, or on a separate system somewhere else.  They
must have network connectivity to the Application Environment.

Developers will generally set up both environments (and operate a web
browser) locally, to facilitate development and debugging, and avoiding
any chance of corrupting data in the production database.  In addition,
setting up such a development environment is a prerequisite for installing
the application on a cloud environment like [Heroku](https://heroku.com).

Once the development environment is set up, there are specific steps
for a Heroku deployment.  See [Installation on Heroku](./INSTALLATION-HEROKU.md)
for more information.

## Cheat Sheets

As you go through the installation process, you will be choosing critically
important values that will be required later on.  The cheat sheets below
offer you a convenient place to write them down, if you print these
instructions and then keep them.  Each value is represented by a "placeholder"
(such as {DBHOST}) in the configuration steps below.  When you see those
placeholders in a configuration file, replace them with the value you have
recorded for name.

**NOTE:  These values are sensitive information, and should never be recorded
in a source code control system like Git, or shared indiscriminately!**

### Database Environment Values

| Placeholder  | Description                                                         | Your Configured Value |
|--------------|---------------------------------------------------------------------|-----------------------|
| {DBHOST}     | Network name of the Postgres host ("localhost" for a local install) |                       | 
| {DBNAME}     | Postgres database name you have selected (normally same as the app) |                       |
| {DBPASSWORD} | Application database password you have selected                     |                       |
| {DBPORT}     | Network port number Postgres is running on (normally 5432)          |                       |
| {DBUSERNAME} | Application database username you have selected                     |                       |
| {PGPASSWORD} | Postgres system *database superuser* password (MUST be configured)  |                       |
| {PGUSERNAME} | Postgres system username (normally "postgres")                      |                       |

### Application Environment Values

| Placeholder  | Description                                                            | Your Configured Value |
|--------------|------------------------------------------------------------------------|-----------------------|
| {APPHOST}    | Network name of the application host ("localhost" for a local install) |                       |
| {APPPORT}    | Network port of the application host (typically 8080 for development)  |                       |
| {SUPASSWORD} | Application password for the superuser user (MUST be configured)       |                       |
| {SUUSERNAME} | Application username for the superuser user (MUST be configured)       |                       |

## Database Environment Installation

These steps must take place on the host computer selected for the
*Database Environment*.

NOTE:  The procedures are different when deploying the production
application to Heroku.  However, a developer will still need to install
these tools locally, as described below.

### Install PostgreSQL (Postgres) and Utilities

Download the latest release of [PostgreSQL](https://www.postgresql.org/download/) for
your platform, and install it.  Installation notes:
* When choosing components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter a password for the *database superuser*, be sure to record it in the **{PGPASSWORD}** entry above.
* Add the directory containing the Postgres command line tools to the **PATH** environment variable in your shell.  On a MacOS system, this will be a directory named like **/Library/PostgreSQL/13/bin**.
* You may need to restart your command line window after making this change.
* Verify that the command line tools by executing *psql --version* and observing the version number response.

Verify successful installation by executing the following command in a command line window:

```shell
psql --version
```

### Create a Postgres Database User

Select (and write down) the values you want to use for the {DBUSERNAME} and
{DBPASSWORD} placeholders.  Then, execute the following command line command:

```shell
createuser --pwprompt {DBUSERNAME}
```

You will be prompted to enter the value you wish to use, which will be the
{DBPASSWORD} value you selected earlier.

### Create Application Database (and Shadow)

Next, select (and write down) a name for the database to be created.  It is
common for the database name to be the same as the application name, but
that is up to you.  Create the database like this:

```shell
createdb --owner={DBUSERNAME} {DBNAME}
```

The database configuration tool we will be using later (graphile-migrate)
also requires a shadow database it can use when tables are created:

```shell
createdb --owner={DBUSERNAME} {DBNAME}_shadow
```

In a development environment **only** you will also need a database that can
be used during testing.  This database will be completely erased and reloaded
during testing, so we do not want tests to be used against a "real" database.

```shell
createdb --owner={DBUSERNAME} {DBNAME}_test
```

To verify successful creation of the production database, issue the following
command:

```shell
psql --usename={DBUSERNAME} {DBNAME}
```

You will be challenged for the corresponding password (the {DBPASSWORD} value),
and then shown a prompt that includes the database name.  Enter **\q** and
press *Enter* to exit this application.

At this point, we have successfully created empty databases.  The required
table structures and initial data will be installed later, as part of the
*Application Environment* setup.

## Application Environment Installation

These steps must take place on the host computer selected for the
*Application Environment*.

### Install Database Command Line Tools

If the *Database Environment* and *Application Environment* are installed on
different computers, you will need to install the database command line tools
locally on the *Application Environment* computer as well.

Download the latest release of [PostgreSQL](https://www.postgresql.org/download/) for
your platform, and install it.  Installation notes:
* When choosing components to be installed, select only *Command Line Tools*.
* Add the directory containing the Postgres command line tools to the **PATH** environment variable in your shell.  On a MacOS system, this will be a directory named like **/Library/PostgreSQL/13/bin**.
* You may need to restart your command line window after making this change.
* Verify that the command line tools by executing *psql --version* and observing the version number response.

### Install Git Command Line Tools

*Git* is a source code control management application that records changes
(as you make them) to the source code.  It is required even on a production
install, because it is needed to download and build the application itself.

Pick the most recent binary release for your platform at
[Git](https://git-scm.com/downloads) and install it.  You may need to
restart your command line window after installation to pick up the PATH changes.
After successful installation, verify the required tools are available
as follows:

```shell
git --version
```

### Install Node.JS Environment

*Node.JS* is the runtime environment that supports execution of Javascript
and Typescript based applications outside of a web browser.  The server portion
of this system is such an application.

Pick the most recent Long Term Support (LTS) release for your platform at
[Node.JS](https://nodejs.org/en) and install it.  You will need to restart
your command line window after installation to pick up the PATH changes.
After successful installation, verify that the required tools are available
as follows:

```shell
node --version
npm --version
```

### Install Node Global Dependencies

Several Node-based technologies must be installed globally, because
they add executable commands we will need later.  Execute the following
commands from the command line.

The [graphile-migrate](https://github.com/graphile/migrate) is used to
manage changes to the database, remembering what changes have been done
previously on any particular database.  Consult the documentation there
for how it operates.

```shell
npm install -g graphile-migrate
graphile-migrate --version
graphile-migrate init
```

### Install Application Source and Executables

The source code for this application is stored in a repository on
[GitHub](https://github.com), a very popular location for both open
source and closed source development projects.  Each application
is stored in it's own location with its own URL.

Navigate to the directory within which you want to install the
application (typically the home directory for the user under which
the application will run), and execute a command like this (where
the */cityteam/stats* portion is unique to this application):

```shell
git clone https://github.com/cityteam/stats.git
```

This will download the relevant source code into a subdirectory
(named "stats" in this case).  Change your current directory to
the subdirectory for the next steps.

### Build Application Components

What we have downloaded is just the source code for the application.
Next, we will utilize the Node.JS development tools to build both
the server portion and the client portion, with the following commands:

```shell
npm install
npm run server:build
cd client
npm install
npm run build
cd ..
```

### Seed Database Table Structure

NOTE:  These steps are different on a Heroku installation -- see
[Heroku Installation](./INSTALLATION-HEROKU.md) for details.

Next, we will execute "migration" utilities that will change our empty database
into one that contains the table structures required by this application.
In order to do this, we must first set up some environment variables.

In a command line window, issue the following commands (on a Windows platform,
use the "set" command instead of "export"), replacing the placeholders with
the values you previously recorded:

```shell
export DATABASE_URL="postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}"
export SHADOW_DATABASE_URL="postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}_shadow"
export ROOT_DATABASE_URL="postgres://{PGUSERNAME}:{PGPASSWORD}@{DBHOST}:{DBPORT}/postgres"
```

Now, execute the following command to perform the defined migrations (steps that
are executed in order to bring the database up to the latest state):

```shell
graphile-migrate migrate
```

You can verify that everything worked by using the Postgres *psql* tool:

```shell
$ psql --username={DBUSERNAME} {DBNAME}
{DBNAME}=# \dt
```

You can investigate the details of how any particular table is set up,
including indexes and foreign key relationships, by running the command

```sql
\dt {tablename}
```

### Set Up Execution Configuration

NOTE:  These steps are different on a Heroku installation -- see
[Heroku Installation](./INSTALLATION-HEROKU.md) for details.

Next, we will set up "environment variable" configurations that define
how the application will execute.  In a production installation,
only the *production* environment needs to be defined.  A developer,
on the other hand, will require all three.

**WARNING:  THESE FILES WILL CONTAIN SENSITIVE INFORMATION
LIKE PASSWORDS, AND SHOULD *NEVER* BE CHECKED IN TO GIT!
MAKE SURE THESE FILENAMES ARE LISTED IN THE *.gitignore*
FILE IN THE TOP LEVEL DIRECTORY OF THE APPLICATION!**

| NODE_ENV Value | Configuration Filename  | Description                                                                            |
|----------------|-------------------------|----------------------------------------------------------------------------------------|
| production     | .env.production         | Choices for production usage                                                           |
| development    | .env.development        | Convenient choices for development                                                     |
| test           | .env.test               | Configuration for running tests (use the test dataqbase!)                              |
| (none)         | .env                    | Should be a copy of the test configuration due to limitations in configuration support |

The variables that may be set in these environment configurations
will vary depending on the actual application, but the following
will be typical:

| Environment Variable | Description                                                                                                 |
|----------------------|-------------------------------------------------------------------------------------------------------------|
| ACCESS_LOG           | Destination for HTTP style access logs (filename, stdout, stderr, or none)                                  |
| CLIENT_LOG           | Destination for application logs from the client (filename, stdout, stderr, or none)                        |
| DATABASE_URL         | postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}                                             |
| HTTPS_CERT           | Pathname to the HTTPS certificate *fullchain.pem* file (if HTTPS supported)                                 |
| HTTPS_KEY            | Pathname to the HTTPS private key *privkey.pem* file (if HTTPS supported)                                   |
| OAUTH_ENABLED        | Are OAuth permissions enforced by the server? (true or false)                                               |
| PORT                 | Network port {APPPORT} on which the server should listen for non-HTTPS connections (not enabled if missing) |
| PORT_HTTPS           | Network port on which the server should listen for HTTPS connections (not enabled if missing)               |
| SERVER_LOG           | Destination for application logs from the server (filename, stdout, stderr, or none)                        |
| SUPERUSER_SCOPE      | OAuth scope that provides "superuser" access (typically "superuser")                                        |

If this is a development environment, in test mode point your DATABASE_URL
at the test database by appending "_test" after {DBNAME}.  Do this in both
*.env.test* and *.env*.

For log file settings, a filename will cause a file with that name to be
created in the *log* subdirectory, and the files will be rotated daily to
a filename that includes the date and time of the rotation.

As a developer, my personal preference is to set all three log configurations
to "stdout" in development and test modes, and setting OAUTH_ENABLED to false
in development mode (but true in test mode).  However, you can configure them
as you like based on your own preferences.

Setting up HTTPS support requires acquiring an HTTPS certificate, as
well as keeping it up to date when it expires.  Detailed instructions are
beyond the scope of this document, but [Let's Encrypt](https://letsencrypt.org)
is a good source of zero-cost certificates for developers.

### Seed A Superuser User

When the database was initially set up in the previous steps, all of the
tables, including the table of valid users, are empty.  We need to add
a superuser user account, in order to set up things like other users, and
all other operations that are restricted to require superuser access.  We
will remedy that deficiency manually:

#### Start the server in development mode

In a command line window, execute the following command:

```shell
npm run start:dev
```

This will start the server using the *.env.development* configuration file's
values.  If you followed the recommended pattern, you would have included
*OAUTH_ENABLED=false* in these settings.  That is mission critical here,
because we cannot get permissions for the calling user to perform the next
task, when there are no valid users.

#### Use an HTTP tool to create the superuser user:

Using Postman (or, you can do this with command line tools like *curl* if you wish),
set up a POST transaction to *http://{APPHOST}:{APPPORT}/api/users* with
a body content type of *application/json* and the following contents:

```json
{
  "name": "Superuser User",
  "scope": "{SUPERUSER_SCOPE}",
  "username": "{SUUSERNAME}",
  "password": "{SUPASSWORD}"
}
```

Send this command to the server, and you should get a 201 CREATED response,
which will include an *id* assigned to the new user (probably 1), and **NO**
included password (for security reasons, the server will never send back
a password).

If you use *psql* to look inside the database, and do *select * from users;*,
you will see that the new user has been stored, but the password field has
been hashed to some unreadable value.  This will occur on any and all users
you add later, as well.  The hashing that took place works only in one direction
-- there is no way to translate back to the original password, so be sure you
remember the password that has been set!

### Verify Client Application Works

While the server is still running, open a browser tab and navigate to
*http://{APPHOST}:{APPPORT}* there.  You should see the application's
user interface, including a *Log In* button.  Click that button, and use
the superuser username and password that were just set up to log in.

If you run into problems, you can use *psql* to delete the database row
previously set up for the superuser user, and repeat the previous step
to create a new one.

When you are through, use Control+C in the server's command line window
to terminate it.

### Prepare Application To Run Permanently

TODO - details about "pm2" in Windows, or equivalent capabilities on
Mac or Linux.
