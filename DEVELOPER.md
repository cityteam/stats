# Developer Documentation

This document describes setting up an environment in which
a developer can set up a local environment in which they can
update, test, and commit changes to the *CityTeam Stats Application*.
These instructions will work on any desktop platform (Linux, MacOS,
or Windows), but the primary development was done on a MacOS laptop.

## Background

To be most effective, developers should become familiar with the
following core technologies (the referenced links point at some canonical
information sources, but there are thousands of other resources available
on the web as well):
* [Javascript](https://javascript.info) - Programming language used on both client and server.
* [Typescript](https://www.typescriptlang.org) - Add-on capabilities that bring type safety and other features to Javascript based applications.
* [Hypertext Markup Language (HTML)](https://developer.mozilla.org/en-US/docs/Web/HTML) - HTML is the language used to create user interfaces on the client, as well as interact with Javascript/Typescript logic to enable interactivity.
* [Node.JS](https://nodejs.org) - Fundamental architecture for server side Javascript/Typescript applications.
* [React](https://reactjs.org) - Fundamental architecture for client side Javascript/Typescript applications.
* [Hypertext Transfer Protocol (HTTP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) - Protocol defining how client and server environments communicate with each other.
* [Representational State Transfer (REST)](https://restfulapi.net) - Architectural style for organizing HTTP message formats (and URI destinations).  This application conforms to REST design principles.
* [Structured Query Language (SQL)](https://postgresql.org/docs/14/index.html) - SQL is the most popular standard for interacting with a database.  This application uses Postgres as its database implementation.
* [Javascript Object Notation (JSON)](https://www.json.org) - The message format used on network messages between the client and server portions of the application.  Also, very similar to the way complex objects are represented in Javascript/Typescript.
* [GitHub](https://github.com) - GitHub is the storage host for this project, as well as many thousands of others.  It features the Git repository management application, with lots of extra goodies.

## Overall Architecture

This application can be described as having four basic components:

TODO - pretty picture (with a brief thing in between each component
describing the technology used).

* **User** - Operates the interactive portion of the application using any modern web browser that supports HTML5 (including web browser capabilities on tablets and phones).
* **Client** - The portion of the application that runs inside the user's web browser. rendering HTML and executing Javascript.
* **Server** - The portion of the application that runs on a backend server, receiving network requests from the client, performing corresonding data retrieval or storage in the database, and returning results to the client.  This portion can operate on a laptop (indeed, you will be running it locally when doing development), on a server connected to a local area network, or on a cloud platform.
* **Database** - The place that data from the application is persisted, even if the application is shut down.  It executes SQL commands to perform its tasks.

## Setting Up Your Development Environment

You will need a laptop with at least 8gb of main memory (16gb is preferrable),
along with at least hundreds of megabytes of disk storage.  In addition, you will
need a user account with administrative privileges that lets you install the required
prerequisite software pieces.

For a developer, our end goal is to set up and run all of the various pieces locally,
on your laptop.  When we get to [Installation](./INSTALLATION.md) for production use,
there are more choices -- which will be discussed in that documentation.

## Install Fundamental Technologies

Follow the links below to install the required fundamental technologies.
The detailed steps required will be found on the linked pages, so only
particular details relevant to this application will be mentioned.

As you are installing the various technologies, you will be making choices
for critically important values that will be required later on.  Here is
a handy table in which you can record them as you go:

*DATABASE ENVIRONMENT VALUES*

| Placeholder  | Description                                                         | Your Configured Value |
|--------------|---------------------------------------------------------------------|-----------------------|
| {DBHOST}     | Network name of the Postgres host ("localhost" for a local install) |                       | 
| {DBNAME}     | Postgres database name you have selected (normally same as the app) |                       |
| {DBPASSWORD} | Application database password you have selected                     |                       |
| {DBPORT}     | Network port number Postgres is running on (normally 5432)          |                       |
| {DBUSERNAME} | Application database username you have selected                     |                       |
| {PGPASSWORD} | Postgres system *database superuser* password (MUST be configured)  |                       |
| {PGUSERNAME} | Postgres system username (normally "postgres")                      |                       |

*APPLICATION ENVIRONMENT VALUES*

| Placeholder  | Description                                                            | Your Configured Value |
|--------------|------------------------------------------------------------------------|-----------------------|
| {APPHOST}    | Network name of the application host ("localhost" for a local install) |                       |
| {SUPASSWORD} | Application password for the superuser user (MUST be configured)       |                       |
| {SUUSERNAME} | Application username for the superuser user (MUST be configured)       |                       |

Later on, we will use these values in configuration files.  When you see a placeholder value
like **{PGPASSWORD}** in the description of a configuration file, replace it with the value
you have recorded above.

## Database Fundamentals

(1) Install PostgreSQL And Utilities

Download the latest release of [PostgreSQL](https://www.postgresql.org/download/) for
your platform, and install it.  Installation notes:
* When choosing components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter a password for the *database superuser*, be sure to record it in the **{PGPASSWORD}** entry above. 
* Add the directory containing the Postgres command line tools to the **PATH** environment variable in your shell.  On a MacOS system, this will be a directory named like **/Library/PostgreSQL/13/bin**.
* You may need to restart your command line window after making this change.
* Verify that the command line tools by executing *psql --version* and observing the version number response.

(2) Create Postgres User

Select (and write down) the values you want to use for the {DBUSERNAME} and
{DBPASSWORD} placeholders.  Then, execute the following command line command:

```shell
createuser --pwprompt {DBUSERNAME}
```

You will be prompted to enter the value you wish to use, which will be the
{DBPASSWORD} value you selected earlier.

(3) Create Application Database (and Shadow)

Next, select a name for the database to be created, and record it as {DBNAME}.
It is common for the database name to be the same as the application name, but
that is up to you.

```shell
createdb --owner={DBUSERNAME} {DBNAME}
```

The database configuration tool (graphile-migrate) requires a shadow database
that is used when tables are created (which we will do later).

```shell
createdb --owner={DBUSERNAME} {DBNAME}_shadow
```

On a development environment (not required for a production install),
we will also need a test database that will be configured similarly:

```shell
createdb --owner={DBUSERNAME} {DBNAME}_test
```

**WARNING:  IT IS VERY IMPORTANT THAT THE TEST DATABASE IS SET
UP AND CONFIGURED (In *.env* AND *.env.test)* AS DESCRIBED BELOW.
OTHERWISE, RUNNING TESTS WILL DESTROY INFORMATION IN YOUR LOCAL
DATABASE!**

To verify that the application database has been successfully created, issue
the following command:

```shell
psql --username={DBUSERNAME} {DBNAME}
```

You will be challenged to enter the corresponding password (the {DBPASSWORD}
value you recorded above).  Connecting with no errors will show you a prompt
that includes the database name.  Enter **\q** to exit.

Before continuing, make sure you have recorded values for *all* of the
DATABASE ENVIRONMENT VALUES above.  You will need them as we continue.

## Source Code Control Fundamentals

### Install Git Command Line Tools

Pick the most recent binary release for your platform at
[Git](https://git-scm.com/downloads) and install it.  You may need to
restart your command line window after installation to pick up the PATH changes.
After successful installation, verify the required tools are available
as follows:

```shell
git --version
```

## Javascript Fundamentals

### Install Node.JS Environment

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

## Development Tool Fundamentals

### Interactive Development Environment

An interactive development environment (IDE) that deeply understands technologies
like Typescript, React, and so on will tremendously improve your productivity as
a developer.  The primary author of this application uses
[IntelliJ IDEA Ultimate](https://jetbrains.com/idea/download), which is extremely
capable, but does cost an annual subscription fee.

A free tool like [Visual Studio Code](https://code.visualstudio.com) would make an
excellent alternative.  It runs on any of the popular platforms, and has a wide
variety of plugin extensions that feature support for the technologies used here.

### HTTP Development Tool

[Postman](https://postman.com/downloads) is an incredibly useful tool for exercizing
HTTP transactions against the server portion of this application, independent of
whether or not the client portion is actually sending the correct inputs (or if that
client support has even been implemented yet).

## Set Up Application Source And Executables

### Download Application Sources

The source code for this application is stored in a GitHub repository.  Navigate
to the parent directory into which you want to manage individual applications, and
issue the following command (or a similar one for different applications):

```shell
git clone https://github.com/cityteam/stats
```

This will download the relevant source code, preconfigured for supporting
updates to a local Git repository, as well as pushes to the GitHub repository when
your changes are ready to be shared.

### Build Initial Application Components

Before you can actually execute the downloaded application, you must install
the dependencies (configured in *package.json* for the server, and
*client/package.json* for the client).  Change directory to the application
home directory (if needed), and execute the following commands:

```shell
npm install
npm run server:build
cd client
npm install
npm run build
cd ..
```

This will leave you positioned in the home directory for this application, where
the subsequent steps will be performed.

## Seed Local Database Structure

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

(If you are going to be changing the database structures in the future, and
will therefore need the ability to create and execute migrations, you will
probably want to build yourself a little shell script that does this.)

Next, execute the following command to perform all of the currently defined
database migrations:

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

### Set Up Local Execution Configuration

Next, we will set up "environment variable" configurations for three
possible ways a developer may wish to execute the application.  You
are free to configure these the way you want, but reflect the
preferences of the original application author (as well as the
predefined scripts in *package.json*).  The configuration
actually selected when you run the application is defined
by the value set for the *NODE_ENV* environment variable.

**WARNING:  THESE FILES WILL CONTAIN SENSITIVE INFORMATION
LIKE PASSWORDS, AND SHOULD *NEVER* BE CHECKED IN TO GIT!
MAKE SURE THESE FILENAMES ARE LISTED IN THE *.gitignore*
FILE IN THE TOP LEVEL DIRECTORY OF THE APPLICATION!**

| NODE_ENV Value | Configuration Filename  | Description                                                                            |
|----------------|-------------------------|----------------------------------------------------------------------------------------|
| production     | .env.production         | Mimic production standard choices                                                      |
| development    | .env.development        | Convenient choices for development                                                     |
| test           | .env.test               | Configuration for running tests (use the test dataqbase!)                              |
| (none)         | .env                    | Should be a copy of the test configuration due to limitations in configuration support |

The variables that may be set in these environment configurations
will vary depending on the actual application, but the following
will be typical:

| Environment Variable | Description                                                                |
|----------------------|----------------------------------------------------------------------------|
| ACCESS_LOG           | Destination for HTTP style access logs (filename, stdout, stderr, or none) |
| CLIENT_LOG           | Destination for application logs from the client (filename, stdout, stderr, or none) |
| DATABASE_URL         | postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME} |
| HTTPS_CERT           | Pathname to the HTTPS certificate *fullchain.pem* file (if HTTPS supported) |
| HTTPS_KEY            | Pathname to the HTTPS private key *privkey.pem* file (if HTTPS supported) |
| OAUTH_ENABLED        | Are OAuth permissions supported by the server? (true or false) |
| PORT                 | Network port on which the server should listen for non-HTTPS connectoins (not enabled if missing) |
| PORT_HTTPS           | Network port on which the server should listen for HTTPS connections (not enabled if missing) |
| SERVER_LOG           | Destination for application logs from the server (filename, stdout, stderr, or none) |
| SUPERUSER_SCOPE      | OAuth scope that provides "superuser" access (typically "superuser") |

For log file settings, a filename will cause a file with that name to be
created in the *log* subdirectory, and the files will be rotated daily to
a filename that includes the date and time of the rotation.

Setting up local HTTPS support requires acquiring an HTTPS certificate, as
well as keeping it up to date when it expires.  Detailed instructions are
beyond the scope of this document, but [Let's Encrypt](https://letsencrypt.org)
is a good source of zero-cost certificates for developers.

Developers are free to configure these settings as they wish.  The original
developer of this application uses the following conventions:
* DATABASE_URL:
  * In *.env.development* and *.env.production*, point at your local {DBNAME} database.
  * In *.env* and *.env.test*, point at your **{DBNAME}_test** database.  **THIS IS CRITICAL TO AVOID OVERWRITING YOUR DATABASE CONTENTS WHEN EXECUTING TESTS!**
* Log files (ACCESS_LOG, CLIENT_LOG, SERVER_LOG):
  * In *.env.development* and *.env.test*, set them all to **stdout** so the output is intermixed in the IDE's output window when running.
  * In *.env.production*, set them to *access.log*, *client.log*, and *server.log* to get the timestamped files in the *log* subdirectory.
* OAUTH_ENABLED:
  * In *.env.development*, set to *false* so you can create and test functionality without worrying about permissions yet.
  * In *.env.test*, set to *true* so the tests that validate OAuth behavior will work correctly.
  * In *.env.production*, set to *true* so that the server enforces checking permissions on all network calls

### Seed A Superuser User

When the database was initially set up in the previous steps, all of the
tables, including the table of valid users, are empty.  We need to add
a superuser user account, in order to set up things like other users, and
all other operations that are restricted to require superuser access.  We
will remedy that deficiency manually:

(1) Start the server in development mode:

In a command line window, execute the following command:

```shell
npm run start:dev
```

This will start the server using the *.env.development* configuration file's
values.  If you followed the recommended pattern, you would have included
*OAUTH_ENABLED=false* in these settings.  That is mission critical here,
because we cannot get permissions for the calling user to perform the next
task, when there are no valid users.

(2) Use Postman to create the superuser user:

Using Postman (or, you can do this with command line tools like *curl* if you wish),
set up a POST transaction to *http://{APPHOST}:{APPPOR}/api/users* with 
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

(3) Verify that the client application works:

While the server is still running, open a browser tab and navigate to
*http://{APPHOST}:{APPPORT}* there.  You should see the application's
user interface, including a *Log In* button.  Click that button, and use
the superuser username and password that were just set up to log in.

If you run into problems, you can use *psql* to delete the database row
previously set up for the superuser user, and repeat the previous step
to create a new one.

When you are through, use Control+C in the server's command line window
to terminate it.

## Preparing For Development

### Configure IDE Shortcuts

In your IDE, set up shortcuts to execute the following server side
NPM scripts (from the top level *package.json* file):
* **develop:dev** -- Start the server in development mode (i.e. using the *.env.development* configuration).
* **develop:prod** -- Start the server in production mode (i.e. using the *.env.production* configuration).

Typically, an IDE will support starting either of these scripts normally, or with
debugging enabled.  The latter will allow you to set breakpoints anywhere within
the server code, step through the server logic, and evaluate expressions.  As an
added benefit, these shortcuts will watch for changes to server source code, and
automatically restart the server to pick up those changes.

In your IDE, set up shortcuts to execute the following client side
NPM scripts (from the *client/package.json* file):
* **build** -- Build a runtime version of the client (which will be served when you point your browser at http://{APPHOST}:{APPPORT}).
* **start** -- Start a development version of the client, on port 3000, that will notice client side code changes and pick them up incrementally.

You can consult the documentation for your IDE to understand how to integrate
debugging of client side applications (which are running inside your browser).

### Committing Changes To The Repository

As part of cloning the application source code in the earlier steps, a local
copy of the Git database will also have been created for you.  There, you can
see the history of all previous changes, make your own commits, create branches
as desired, roll back changes, and all the other good things that Git can do.

When you are ready to publish your changes to the GitHub repository (and therefore
other developers), first test thoroughly and commit your changes locally.  Then,
issue the following command line command (or its IDE shortcut equivalent):

```shell
git push
```

If other developers have published changes that you have not yet seen, you can
use the following command (or its IDE shortcut equivalent):

```shell
git pull
```

Various development teams have adopted various ways of working about who
pushes changes when, who tags releases, and various other collaborations.
Work with your team to establish and conform to the standards that make
sense for this project.

### Diving Into The Code

At first glance, even a fairly simple full stack application like this
can be very intimidating to grasp.  See the [Design Notes](./DESIGN.md)
for useful background on how the server back end, and client front end,
code is organized, along with the design principles used in
architecting and building it.

One useful starting point, however, is documentation on the REST API
that the client and server use to communicate.  If the application is
running, navigate your browser to *http://{APPHOST}:{APPPORT}/openapi*
to see documentation for this, in a format that conforms to the
[Open API 3.0 Specification](https://swagger.io/specification/) --
a very popular way for projects to document what kinds of messages can
be sent back and forth, and the URLs to which such messages are sent.
This documentation is mechanically generated by code in the server
application, but this URL does not appear in the navigation bar because
it is only relevant for developers.


