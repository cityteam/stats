# Developer Documentation

This document describes setting up an environment in which
a developer can set up a local environment in which they can
update, test, and commit changes to the application's repository.
These instructions will work on any desktop platform (Linux, MacOS,
or Windows), but the primary development was done on a MacOS laptop.

## Setting Up Your Development Environment

You will need a laptop with at least 8gb of main memory (16gb is
preferrable), along with at adequate gigabytes of disk storage.
In addition, you will need a user account with administrative
privileges that lets you install the required prerequisite
software pieces.

In general, a developer will follow all of the steps in
[Installation Documentation](docs/INSTALLATION.md), while installing
both the *Database Environment* and *Application Environment* on
your laptop.  There are some additional useful tools for development
that are highly recommended, and are discussed below.

### HTTP Development Tool

[Postman](https://postman.com/downloads) is an incredibly useful tool
for exercising HTTP transactions against the server portion of this
application, independent of whether or not the client portion is
actually sending the correct inputs (or if that client support
has even been implemented yet).

### Interactive Development Environment

An interactive development environment (IDE) that deeply understands
technologies like Typescript, React, and so on will tremendously improve
your productivity as a developer.  The primary author of this application
uses [IntelliJ IDEA Ultimate](https://jetbrains.com/idea/download), which
is extremely capable, but does cost an annual subscription fee.

A free tool like [Visual Studio Code](https://code.visualstudio.com) would
make an excellent alternative.  It runs on any of the popular platforms,
and has a wide variety of plugin extensions that feature support for the
technologies used here.

## Preparing For Development

### Configure IDE Shortcuts for Server Side

In your IDE, set up shortcuts to execute the following server side
NPM scripts (from the top level *package.json* file):
* **develop:dev** -- Start the server in development mode (i.e. using the *.env.development* configuration).
* **develop:prod** -- Start the server in production mode (i.e. using the *.env.production* configuration).

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

## Committing Changes To The Repository

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

