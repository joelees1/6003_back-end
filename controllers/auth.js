/** This module configures Koa Passport middleware with the JWT authentication strategy.
 * @module controllers/auth
 * @requires koa-passport
 * @requires strategies/jwt
 */

const passport = require('koa-passport');
const strategy = require('../strategies/jwt');

/** configure passport with the JWT authentication strategy
 * @function use
 * @param {object} strategy - The JWT authentication strategy
*/
passport.use(strategy);

/** export the passport middleware */
module.exports = passport.authenticate(['jwt'], {session:false});
