# Developer Documentation

This document describes setting up an environment in which
a developer can set up a local environment in which they can
update, test, and commit changes to the *CityTeam Stats Application*.
These instructions will work on any desktop platform (Linux, MacOS,
or Windows), but the primary development was done on a MacOS laptop.

## Background

To be most effective, developers should be familiar with the
following core technologies (the referenced link point at canonical
information sources, but there are thousands of other resources available
as well):
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

### Install Fundamental Technologies

Follow the links below to install the required fundamental technologies.
The detailed steps required will be found on the linked pages, so only
particular details relevant to this application will be mentioned.

#### Source Code Control Fundamentals

TODO - git

#### Javascript Fundamentals

##### Node.JS Environment

[Node.JS](https://nodejs.org/en) - Pick the most recent LTS version for your OS.
* Successful installation will make the *node* execution envionment, and the *npm* package management tool, available.
* Check version numbers by executing *node -v* and *npm -v* from the command line.

Several Node-based technologies must be installed globally, because
they add executable commands we will need later.  Execute the following
commands from the command line:
* *npm install -g graphile-migrate* - Database migration tool.

#### Database Fundamentals

