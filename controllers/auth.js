const passport = require('koa-passport');
const strategy = require('../strategies/jwt');

passport.use(strategy);

module.exports = passport.authenticate(['jwt'], {session:false});
