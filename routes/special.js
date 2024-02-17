const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../controllers/auth');
const model = require('../models/users');
const config = require('../config');

const router = Router({ prefix: '/api/v1' });

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);
router.post('/login', bodyParser(), login); // Login route

function publicAPI(ctx) {
  ctx.body = { message: 'PUBLIC PAGE: You requested a new message URI (root) of the shop API' }
}

function privateAPI(ctx) {
  const user = ctx.state.user;
  const formattedDate = user.created_at.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.body = { message: `Hello ${user.username}, user since the ${formattedDate}` }
}

// Verify password
const verifyPassword = async function (result, password) {
  return await bcrypt.compare(password, result.password);
}

// Login route handler
async function login(ctx) {
  const details = ctx.request.body;

  try {
    // Find user by username
    const [user] = await model.findByUsername(details.username);
    const result = user[0];

    // Check if user exists and password is correct
    if (!result || result.length === 0 || !(await verifyPassword(result, details.password))) {
      ctx.status = 401; // Unauthorized
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    // Generate JWT token
    const token = jwt.sign(result, config.jwtSecret, { expiresIn: '100d' }); // 40 minutes expiration
    ctx.body = { token }; // Send token in response
    ctx.status = 200; // OK
    
  } catch (error) {
    console.error('Error during login:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}

module.exports = router;
