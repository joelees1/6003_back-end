# 6003CEM_leesj4_Back-end

## Project Overview

This repository contains the backend API for an online art e-commerce website. It provides RESTful endpoints to facilitate user registration, order placement, address management, and product browsing functionalities. Users are able to browse art on the site and make an account to order pieces they like. 

## Key Features

* **User Authentication:** Secure user registration and login system using json web tokens.
* **Product Management:**  Endpoints for viewing and filtering art products.
* **Order Processing:**  Handles making orders, and order status tracking.
* **User & Address Management:** Enables users to register and manage an account as well as a shipping address.
* **Admin methods** gives easy to use ui for consumtion of admin resources like editing and deleting users, products, categories and orders
* **Comprehensive OpenAPI and jsdoc documentation**

## Technology Stack

* **Node.js:** Server-side JavaScript runtime environment.
* **KOA:**  Web framework  for API endpoint creation.
* **MySql:** Database.

## Documentation

To read OpenAPI docs run the html file docs/openapi/index.html

To generate jsdoc documentation:
- install npm package: $ npm install --save-dev jsdoc
- run: $ ./node_modules/jsdoc/jsdoc.js -c jsdoc.conf.json
- run docs/jsdocs/index.html with live server or similar
