# Install Development Environment Locally

This document describes installing this application locally so that you can
operate it, test it, and update it.  You can use any operating system that
supports the required tools (such as Linux, MacOS, and Windows).  You will
need to have a user account that is entitled to install system level software,
as well as at least 8gb of main memory (16gb is preferable) along with
adequate gigabytes of disk storage

As you go through the installation process, you will be deciding on several
configuration settings (such as usernames and passwords).  A convenient way
to record these decisions is to print a copy of the [Cheat Sheet](./CHEATSHEET.md)
and write them down as you choose appropriate values.  These values will be
used later in the installation to set up *Environment Files* for each runtime
mode (development, test, production).  These values are sensitive information,
and are different for each developer, so these environment files should
**NEVER** be checked in to a Git repository.

## (Optional) HTTPS Support Installation

TODO - document [Let's Encrypt](https://letsencrypt.org) info.

## Developer Tools Installation

### Interactive Developer Environment

An interactive development environment (IDE) that deeply understands
technologies like Typescript, React, and so on will tremendously improve
your productivity as a developer.  The primary author of this application
uses [IntelliJ IDEA Ultimate](https://jetbrains.com/idea/download), which
is extremely capable, but does cost an annual subscription fee.

A free tool like [Visual Studio Code](https://code.visualstudio.com) would
make an excellent alternative.  It runs on any of the popular platforms,
and has a wide variety of plugin extensions that feature support for the
technologies used here.

### HTTP Development Tool

[Postman](https://postman.com/downloads) is an incredibly useful tool
for exercising HTTP transactions against the server portion of this
application, independent of whether the client portion is
actually sending the correct inputs (or if that client support
has even been implemented yet).


## Database Environment Installation

### Install Postgres and Utilities

If you do not already have Postgres installed, download the
[Latest Production Version](https://postgresql.org/downloads)
for your operating system, and execute the installer.  Installation Notes:
* When choosing the components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter a password for the *database superuser*, record it as the `{PGPASSWORD}` value on the Cheat Sheet.
* Add the directory containing the Postgres command line tools to the **PATH** environment variable for your shell.  On a MacOS system, this will be in a directory named something like `/Library/PostgreSQL/13/bin`.
* You may need to restart your command line window after making this change.
* Verify successful installation by executing the following shell command:

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

### Create Application Database (and Test Version)

Next, select (and write down) a name for the database to be created.  It is
common for the database name to be the same as the application name, but
that is up to you.  Create the database like this:

```shell
createdb --owner={DBUSERNAME} {DBNAME}
```

In a development environment, you will also need a database that can
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
table structures and initial data will be created the first time that the
server application is started, later on.

### Install Git Command Line Tools

*Git* is a source code control management application that records changes
(as you make them) to the source code.

If you do not have Git installed already, pick the most recent binary release
for your platform at [Git](https://git-scm.com/downloads) and install it.
You may need to restart your command line window after installation to pick
up the PATH changes.  After successful installation, verify the required tools
are available as follows:

```shell
git --version
```

### Install Node.JS Environment

*Node.JS* is the runtime environment that supports execution of Javascript
and Typescript based applications directly from the command line.
The server portion of this system is such an application.

Pick the most recent Long Term Support (LTS) release for your platform at
[Node.JS](https://nodejs.org/en) and install it.  You will need to restart
your command line window after installation to pick up the PATH changes.
After successful installation, verify that the required tools are available
as follows:

```shell
node --version
npm --version
```

### Install Application Source and Executables

The source code for this application is stored in a repository on
[GitHub](https://github.com), a very popular location for both open
source and closed source development projects.  Each application
is stored in a separate repository with its own URL.

Navigate to the directory within which you want to install the
application (typically the home directory for the user under which
the application will run), and execute a command like this:

```shell
git clone https://github.com/cityteam/stats.git
```

This will download the relevant source code into a subdirectory
(named "stats").  Change your current directory to the new
subdirectory for the next steps.

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

### Set Up Execution Configuration

Next, we will set up "environment variable" configurations that define
how the application will execute.  Which environment configuration is
actually used will depend on how you start the server, as we will see later.

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

The variables that may be set in these environment configurations will be as follows:

| Environment Variable | Description                                                                                                 |
|----------------------|-------------------------------------------------------------------------------------------------------------|
| ACCESS_LOG           | Destination for HTTP style access logs (filename, stdout, stderr, or none)                                  |
| CLIENT_LOG           | Destination for application logs from the client (filename, stdout, stderr, or none)                        |
| DATABASE_TOKEN       | Arbitrary token that serves to authenticate database backup requests                                        |
| DATABASE_URL         | postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}                                             |
| HTTPS_CERT           | Pathname to the HTTPS certificate *fullchain.pem* file (if HTTPS supported)                                 |
| HTTPS_KEY            | Pathname to the HTTPS private key *privkey.pem* file (if HTTPS supported)                                   |
| OAUTH_ENABLED        | Are OAuth permissions enforced by the server? (true or false)                                               |
| PORT                 | Network port {APPPORT} on which the server should listen for non-HTTPS connections (not enabled if missing) |
| PORT_HTTPS           | Network port on which the server should listen for HTTPS connections (not enabled if missing)               |
| SERVER_LOG           | Destination for application logs from the server (filename, stdout, stderr, or none)                        |
| SUPERUSER_SCOPE      | OAuth scope that provides "superuser" access (typically "superuser")                                        |

In a development environment, for test mode point your DATABASE_URL
at the test database by appending "_test" after {DBNAME}.  Do this in both
*.env.test* and *.env*.

For the OAUTH_ENABLED value, I like to set this to true in *.env.production* and false
in *.env.development*.  The effect of this value is to choose whether the server should
enforce OAuth-based permissions or not.  It is sometimes easier to initially develop
a new set of REST endpoints without enforcing these restrictions, but you should always
make sure your new logic works in production mode before checking code in.

For log file settings, a filename will cause a file with that name to be
created in the *log* subdirectory, and the files will be rotated daily to
a filename that includes the date and time of the rotation.  As a developer,
I like to use "stdout" for all three, so everything will be merged into the
runtime output in my IDE.

### Configure IDE Shortcuts for Server Side

In your IDE, set up shortcuts to execute the following server side
NPM scripts (from the top level *package.json* file):
* **develop:dev** -- Start the server in development mode (i.e. using the *.env.development* configuration).
* **develop:prod** -- Start the server in production mode (i.e. using the *.env.production* configuration).
* **test** -- Run all the server side tests (using the *.env.test* configuration).
* **test:coverage** -- Run all the server side tests, and report code coverage for every file.

Typically, an IDE will support starting either of these scripts normally,
or with debugging enabled.  The latter will allow you to set breakpoints
anywhere within the server code, step through the server logic, and
evaluate expressions.  As an added benefit, these shortcuts will watch
for changes to server source code, and automatically restart the server
to pick up those changes.

### Configure IDE Shortcuts for Client Side

In your IDE, set up shortcuts to execute the following client side
NPM scripts (from the *client/package.json* file):
* **build** -- Build a runtime version of the client (which will be served when you point your browser at http://{APPHOST}:{APPPORT}).
* **start** -- Start a development version of the client, on port 3000, that will notice client side code changes and pick them up incrementally.

You can consult the documentation for your IDE to understand how to integrate
debugging of client side applications (which are running inside your browser).

## Seeding Database Table Structure

### Start Server Application For The First Time

When the server application is started for the first time (with an empty database),
it will automatically create all the required tables, but they will all be empty.
* Execute the IDE shortcut **develop:dev** that you created earlier.

### Create a Superuser User

When the database was initially set up in the previous steps, all the
tables, including the table of valid users, are empty.  We need to add
a superuser user account, in order to set up things like other users, and
all other operations that are restricted to require superuser access.  We
will remedy that deficiency manually, by using Postman.

Using Postman (or, you can do this with command line tools like *curl* if you wish),
set up a POST transaction to *http://{APPHOST}:{APPPORT}/api/users* with
a body content type of *application/json* and the following contents:

```json
{
  "name": "Superuser User",
  "scope": "superuser",
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

### Seed a Facility Object

You will also need to create a CityTeam *Facility* to use for testing.  You can
again use Postman (or curl) to set up a POST transaction to *http://{APPHOST}:{APPPORT}/api/facilities*
with a body content type of *application/json* and the following contents:

```json
{
  "name": "Test Facility",
  "scope": "test"
}
```

Send this command to the server, and you should get a 201 CREATED response,
which will include an *id* assigned to the new facility (probably 1).

If you use *psql* to look inside the database, and do a *select * from facilities;*,
you will see that the new Facility has been created.

### Set Up Sections and Categories

Continuing our use of Postman or curl, set up a POST transaction to
*http://{APPHOST}:{APPPORT}/api/facilities/1/categories* with a body
content type of *application/json* and the following contents:

```json
{
}
```

This will configure a standard set of Sections and Categories for your
test Facility.

## Get The Client Running

### Start The Client Application

Use the *start* IDE shortcut that you set up earlier to start the client.
This will compile the client side code, and open a tab in your browser
pointing at **http://localhost:3000** which should be running the application.
A very nice feature is that the *start* script will be watching for changes
you have made in the client side code, and automatically update what you see
in the browser.

### Log In

Click the **Log In** button in the navigation bar, and you will be asked
for your credentials.  Use the {SUUSERNAME} and {SUPASSWORD} values that
you used when creating the Superuser user.

After logging in, use the *Facility* dropdown to select the Test Facility
that was created earlier.

### Set Up Test Users

You will want to set up at least two users -- one with administrative
capabilities for your test Facility, and one with regular capabilities
for one or more sections related to the test Facility.

Use the *Admin -> Users* menu option to navigate to the list of all Users
that exist in the system.  The only one that will be there now is the
superuser user that we created earlier.

Click either **Add** button to create a new admin user:
* I like to use a username of "ta" and password of "ta" for this, because they are easy to type.
* Under the *Permissions* heading, click the "admin" option and unclick the "regular" option.
* Click the **Save** button to save this user.
* When returned to the list, you should now see two users.

Click either **Add** button again, to create a new regular User:
* I like to use a username of "tr" and a password of "tr" for this, because they are easy to type.
* Under the *Permissions* heading, leave the "admin" option unchecked, and the "regular" option checked.
* Under the *Sections* heading, you are choosing which sections that this User has access to in the rest of the application.  Select a couple of them (say "clothing" and "kitchen").
* Click the **Save** button to save this user.
* When returned to the list, you should now see three users.

### Verify Limited Access for the Regular User

Log off of the superuser username, and log in with the credentials for the regular
User that you just created.
* Choose the *Entries* menu option from the navigation bar.
* You should see that only the Sections that you authorized for this User are displayed.

### Verify Unlimited Access for the Admin User

Log off the regular user username, and log in with the credentials for the admin
User that you created earlier.
* Choose the *Entries* menu option from the navigation bar.
* You should see all the defined Sections, because the admin User can use all of them.

### Explore The Help Information

Select the *Help* menu option from the navigation bar, and you can explore
the user focused documentation of how to operate the application.
