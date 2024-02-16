const Koa = require('koa');
const passport = require('koa-passport');

const special = require('./routes/special.js')
const users = require('./routes/users.js');
const addresses = require('./routes/addresses.js');

const app = new Koa();
app.use(passport.initialize()); // Initialize Passport

app.use(special.routes());
app.use(users.routes());
app.use(addresses.routes());

let port = process.env.PORT || 3000;
app.listen(port);