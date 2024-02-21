/**
 * @file creates a Koa application and starts the server.
 * @author Joseph
 */

const Koa = require('koa');
const passport = require('koa-passport');

const special = require('./routes/special.js')
const users = require('./routes/users.js');
const addresses = require('./routes/addresses.js');
const products = require('./routes/products.js');
const categories = require('./routes/categories.js');
const orders = require('./routes/orders.js');

/** Initializes and configures a Koa application instance.
 * @function createApp
 * @returns {Koa} The configured Koa application object.
 */
function createApp() {
    const app = new Koa();

    // configure passport
    app.use(passport.initialize()); 

    // Attach application routes for various resources
    app.use(special.routes());
    app.use(users.routes());
    app.use(addresses.routes());
    app.use(products.routes());
    app.use(categories.routes());
    app.use(orders.routes());

    return app;
}

/** Starts the Koa server on a specified port.
 * @function startServer
 * @param {number} [port=3000] - The port to listen on.
 */
function startServer(port = 3000) {
    const app = createApp();
    app.listen(port);
}

startServer(); 