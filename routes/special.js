/** 
 * @module routes/special
 * @author Joseph
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires controllers/auth
 * @requires models/users
 * @requires config
 * @requires controllers/validation
 * @see models/users for db operations
 * @see controllers/auth for auth middleware
 * @see controllers/validation for validation functions
*/

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../controllers/auth');
const model = require('../models/users');
const config = require('../config');

// Import validation function
const { validateLogin } = require('../controllers/validation');

const router = Router({ prefix: '/api/v1' });

router.get('/', publicAPI);
router.post('/login', bodyParser(), login);


/** bcrypt verify password function 
 * @async
 * @param {Object} result - user object
 * @param {string} password - password
 * @returns {Promise} - Promise object represents the result of the comparison
*/
const verifyPassword = async function (result, password) {
	return await bcrypt.compare(password, result.password);
}

/** public API route 
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
function publicAPI(ctx) {
	ctx.body = { message: 'PUBLIC PAGE: You requested a new message URI (root) of the shop API' }
}

/** login route 
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object containing the json web token used in subsequent requests
*/
async function login(ctx) {
	// get details from btoa encoded string in the header
	console.log('Authorization header:', ctx.headers.authorization);
	const encoded = ctx.headers.authorization.split(' ')[1];
	const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
	const [username, password] = decoded.split(':'); // Split into username and password directly
	const details = { username, password };
	console.log('Login details:', details);

	try {
		// Find user by username
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
		const { id, username, email, role } = user;
		const links = {
			self: `/users/${id}`
		};
		ctx.body = { id, username, email, role, token, links };
		ctx.status = 200; // OK

	} catch (error) {
		console.error('Error during login:', error);
		ctx.status = 500;
		ctx.body = { error: 'Internal server error' };
	}
}
  

module.exports = router;
