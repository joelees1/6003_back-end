const Koa = require('koa');
const passport = require('koa-passport');

const special = require('./routes/special.js')
const users = require('./routes/users.js');
const addresses = require('./routes/addresses.js');
const products = require('./routes/products.js');
const categories = require('./routes/categories.js');
const orders = require('./routes/orders.js');

const app = new Koa();
app.use(passport.initialize()); // Initialize Passport

app.use(special.routes());
app.use(users.routes());
app.use(addresses.routes());
app.use(products.routes());
app.use(categories.routes());
app.use(orders.routes());

let port = process.env.PORT || 3000;
app.listen(port);