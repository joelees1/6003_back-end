/**
 * @file creates a Koa application and starts the server.
 * @author Joseph
 * @namespace index
 */

const Koa = require('koa');
const passport = require('koa-passport');
const cors = require('@koa/cors');

const special = require('./routes/special.js')
const users = require('./routes/users.js');
const addresses = require('./routes/addresses.js');
const products = require('./routes/products.js');
const categories = require('./routes/categories.js');
const orders = require('./routes/orders.js');

/** Initializes and configures a Koa application instance.
 * @function createApp
 * @memberof index
 * @returns {Koa} The configured Koa application object.
 */
const app = new Koa();
app.use(cors()); // enable CORS
app.use(passport.initialize()); // configure passport

// Attach application routes for various resources
app.use(special.routes());
app.use(users.routes());
app.use(addresses.routes());
app.use(products.routes());
app.use(categories.routes());
app.use(orders.routes());

module.exports = app;


/** Starts the Koa server on a specified port.
 * @function startServer
 * @memberof index
 * @param {number} [port=3000] - The port to listen on.
 */
