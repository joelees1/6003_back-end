# 6003CEM_leesj4_Back-end

## Project Overview

This repository contains the backend API for an online art e-commerce website. It provides RESTful endpoints to facilitate user registration, order placement, address management, and product browsing functionalities. Users are able to browse art on the site and make an account to order pieces they like.

## Setup
- install npm packages with 'npm install' which will get all dependencies from package.json files
- create 6003_CW and 6003_CW_tests databases, use sql generation scripts to create tables and data in 6003_CW (copied automatically into test db)
- run 'nodemon .' to run index file

## Testing:
To run automated tests run 'npm start', might have to edit some resource id's to get all to pass as they might be dependent on certain id's existing.

admin user:
username = admin, password = password

regular user:
username = user, password = password (or register for a new account)

## Key Features

* **User Authentication:** Secure user registration and login system using json web tokens.
* **Product Management:**  Endpoints for viewing and filtering art products.
* **Order Processing:**  Handles making orders, and order status tracking.
* **User & Address Management:** Enables users to register and manage an account and shipping address.
* **Admin methods** gives clear UI for consumption of admin resources like editing and deleting users, products, categories and orders
* **Comprehensive OpenAPI and jsdoc documentation**

## Technology Stack

* **Node.js:** Server-side JavaScript runtime environment.
* **KOA:** API framework.
* **MySql:** Database.

## Documentation

To read OpenAPI docs run the html file docs/openapi/index.html

To generate jsdoc documentation:
- install npm package: $ npm install --save-dev jsdoc
- run: $ ./node_modules/jsdoc/jsdoc.js -c jsdoc.conf.json
- run docs/jsdocs/index.html with live server or similar
