# Northcoders News API
---
# Northcoders News API
---
### Introduction
Northcoders News is a REST API for a an online news service, built around an SQL database using PostgreSQL and the Node.js Express framework. It was built using Test Driven Development using Supertest and Jest.

The hosted version can be found here: [Northcoders News API](https://rh-nc-news.onrender.com/api/)

### Project Support Features
* Public users can make GET requests at each endpoint to view the database through a web browser by following the link to the hosted version.
* Developers should **CLONE THE REPO** and use a REST client to make PATCH, POST, and DELETE requests.
* Refer to /api/ for full HTTP Verbs, Endpoints and Action Descriptions.

## Minimum Requirements
* **Node.js**: v14.0.0 or above
* **PostgreSQL**" v12.0 or abaove.

### Installation guide 
* Clone this repository [here](https://github.com/RKHarrison/RKH-NC-News)
* Run npm install to install all dependencies (full list [here](./package.json))
* Add .env files (see NOTE TO DEVELOPERS below)
* Run npm start to start the application
* Connect to the API using [Insomnia](https://insomnia.rest/) or another REST client on port 9090.

### NOTE TO DEVELOPERS: 
* Please **add your own .env files** to any cloned version of this repo in order to successfully connect locally to the two included databses. These will be use in conjunction with environment variables to make sure the correct DB is connected to.
* In the main folder, create two files named .env.test and .env.deleopment, to reference either database as required. Within the file(s), use the syntax: "PGDATABASE=database_name_here" and include the appropriate database name (see /db/setup.sql for the database names).
**Please make sure the .env files are added to .gitignore and that the database names are not shared publicly!**
---

### Main Technologies Used
* [NodeJS](https://nodejs.org/) An open-source, cross-platform runtime environmnet for running JavaScript outside of the broweser. Runs on Chrome's V8 JavaScript engine. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) NodeJS web application framework.
* [PostgreSQL](https://www.postgresql.org/) An open-source relational databse management system.
* [Jest](https://jestjs.io/) JavaScript testing framework. Also using the [jest-sorted](https://www.npmjs.com/package/jest-sorted) matcher extension.
* [Supertest](https://www.npmjs.com/package/supertest) HTTP testing library.
* [Dotenv](https://www.npmjs.com/package/dotenv) Loads environment variables from a .env file into process.env.
* [Node-pg-format](https://www.npmjs.com/package/pg-format) Used to safely create dynamic SQL queries.
--- 


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
