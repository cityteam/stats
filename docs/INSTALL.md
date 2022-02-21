[Home](./index.md)

# Information for Installers

This document describes installing this application into one of two
operational environments:
* As a developer, who will be updating the application's software.  If you will also
  be deploying the application to Heroku, perform the installation as a developer,
  and then follow the additional [Deploy To Heroku](./DEPLOY.md) instructions.
* As an administrator, who is installing this application in a standalone environment.

Unless otherwise mentioned in the instructions below, you will need to perform all of
these steps for each operational environment.

As you decide on configuration values during the installation, you should print out a copy of the [Cheat Sheet](./CHEATSHEET.md) to save them.

## Database Environment Installation

You can choose to install the database on a different computer (as long as it is accessible on your network).  However, you will generally install the database
on the same computer (which is known as `localhost`) as the application software.
Record the network name of this host as the `{DBHOST}` value on the Cheat Sheet.

### Install PostgreSQL (Postgres) and Utilities

Download and install the latest release of [PostgreSQL](https://www.postgresql.org/download/) for your platform, and install it.  Installation notes:
* When choosing the components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter a password for the *database superuser*, record it as the `{PGPASSWORD}` value on the Cheat Sheet.
* Add the directory containing the Postgres command line tools to the **PATH** environment variable for your shell.  On a MacOS system, this will be in a directory named something like `/Library/PostgreSQL/13/bin`.
* You may need to restart your command line window afrter making this change.
* Verify successful installation by executing the following shell command:

```shell
psql --version
```

### Create a Postgres Database User

Select (and write down on the Cheat Sheet) values for the database username and
database password (`{DBUSERNAME}` and `{DBPASSWORD}`) that the application will use to access the database.  Next, on the computer that will contain the database, create the user with the following shell command:

```shell
createuser --pwprompt {DBUSERNAME}
```
You will be prompted to enter the `{DBPASSWORD}` value that you have selected.  For security reasons, this will not be echoed to your screen, so you will need to enter it twice to make sure there were no typos.

### Create Application Database (and Shadow)

Next, select (and write down as the `{DBNAME}` value on the Cheat Sheet) a name for the database that will be used by this application.  Normally, you will name the database after the application itself, but you can choose any name you like.  Create the database with a shell command like this:

```shell
createdb --owner={DBUSERNAME} {DBNAME}
```

To verify that everything is working so far, make sure you can successfully access the new database with a shell command like this:

```shell
psql --username={DBUSERNAME} {DBNAME}
```

You will be challenged for the corresponding password (the `{DBPASSWORD}` value), and then shown a prompt that includes the database name.  Enter **\q** and press *Enter* to exit this application.

The database configuration tool we will be using later (graphile-migrate) also requires a shadow database that it can use when tables are created.  Create it like this:

```shell
createdb --owner={DBUSERNAME} {DBNAME}_shadow
```

If you are installing the database on your developer computer, you will also need a third database on which you will execute tests:

```shell
createdb --owner={DBUSERNAME} {DBNAME}_test
```

## Application Environment Installation

### Install Database Command Line Tools

If the database environment is installed on a different computer than the application environment, the database command line tools must be installed locally on the computer where the application is running as well.

Download and install the latest release of [PostgreSQL](https://www.postgresql.org/download/) for your platform, and install it.  Installation notes:
* When choosing the components to be installed, select only *Command Line Tools*.
* Add the directory containing the Postgres command line tools to the **PATH** environment variable for your shell.  On a MacOS system, this will be in a directory named something like `/Library/PostgreSQL/13/bin`.
* You may need to restart your command line window afrter making this change.
* Verify successful installation by executing the following shell command:

```shell
psql --version
```
### Install Git Command Line Tools

*Git* is a source code control management application that records changes (as you make them) to the source code.  It is required even on a production application install, because it is needed to download and build the application itself.

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

(If you are installing a different application, replace the *stats* portion of this URL with the name of the relevant application).

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
[Deploying opn Heroku](./DEPLOYMENT.md) for details.

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
\d {tablename}
```

### Set Up Execution Configuration

NOTE:  These steps are different on a Heroku installation -- see
[Deploying on Heroku](./DEPLOY.md) for details.

Next, we will set up *environment variable* configurations that define
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
