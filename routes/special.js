/** 
 * @module routes/special
 * @author Joseph
*/

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../controllers/auth');
const model = require('../models/users');
const config = require('../config');

const { validateLogin } = require('../controllers/validation');

const router = Router({ prefix: '/api/v1' });

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);
router.post('/login', bodyParser(), validateLogin, login);


/** bcrypt verify password function 
 * @function verifyPassword
 * @param {Object} result - user object
 * @param {string} password - password
 * @returns {Promise} - Promise object represents the result of the comparison
*/
const verifyPassword = async function (result, password) {
  return await bcrypt.compare(password, result.password);
}

/** public API route */
function publicAPI(ctx) {
  ctx.body = { message: 'PUBLIC PAGE: You requested a new message URI (root) of the shop API' }
}

/** private API route */
function privateAPI(ctx) {
  const user = ctx.state.user;
  const formattedDate = user.created_at.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.body = { message: `Hello ${user.username}, user since the ${formattedDate}` }
}

/** login route */
async function login(ctx) {
  const details = ctx.request.body;

  try {
    /** Get user from database by username
     * @function findByUsername
     * @param {string} details.username - username
     * @returns {Promise} - Promise object represents the user
    */
    const [result] = await model.findByUsername(details.username);
    const user = result[0];

    // Check if user exists and password is correct
    if (!user || user.length === 0 || !(await verifyPassword(user, details.password))) {
      ctx.status = 401; // Unauthorized
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    /** Create json web token
     * @function sign
     * @param {Object} user - user object
     * @param {string} config.jwtSecret - jwt secret
     * @param {Object} expiresIn - expiration time
     * @returns {string} - token
    */
    const token = jwt.sign(user, config.jwtSecret, { expiresIn: '100d' });
    ctx.body = { token }; // Send token in response
    ctx.status = 200; // OK

  } catch (error) {
    console.error('Error during login:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}

module.exports = router;
