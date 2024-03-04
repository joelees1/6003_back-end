/**
 * @module routes/users
 * @description API routes for managing users, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires bcrypt
 * @requires models/users
 * @requires models/products
 * @requires models/addresses
 * @requires controllers/auth
 * @requires permissions/users
 * @requires controllers/validation
 * @see models/users for db operations
 * @see controllers/auth for auth middleware
 * @see permissions/users for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const model = require('../models/users');
const addressModel = require('../models/addresses');
const auth = require('../controllers/auth');
const can = require('../permissions/users');

// Import validation functions
const { validateUser } = require('../controllers/validation');
const { validateUserUpdate } = require('../controllers/validation');

const router = Router({ prefix: '/api/v1/users' });

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);


/** get all users
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAll(ctx) {
    try {
        // Only admins
        const permission = can.readAll(ctx.state.user);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const [users] = await model.getAll();

        // If users are found, return them
        if (users.length) {
            ctx.body = users;
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No users found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve users' };
    }
} 

/** get a single user by its id
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getById(ctx) {
    try {
        let id = parseInt(ctx.params.id) // requested data id

        // Only admins and the owner
        const permission = can.read(ctx.state.user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'Permission denied' };
            return;
        }

        let [user] = await model.getById(id);

        // If an user is found
        if (user.length) {
            ctx.body = permission.filter(user[0]); // filter the user using the permissions to not return certain fields
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'user not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve the user' };
    }
}

/** create a new user
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function createUser(ctx) {
    try {
        const body = ctx.request.body;

        const hashedPassword = await bcrypt.hash(body.password, 10); // 10 is the salt rounds
        body.password = hashedPassword;

        let [result] = await model.add(body);
        if (result) {
            ctx.status = 201; // 201 Created
            ctx.body = { ID: result.insertId, link: `/api/v1/users/${result.insertId}` };
        }
    } 
    catch (error) {
        console.error(error.code);
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            ctx.status = 400; // duplicate entry
            ctx.body = { error: 'Username or Email already exists' };
        } else {
            ctx.status = 500;
            ctx.body = { error: 'Failed to create the user' };
        }
    }
}

/** update an existing user with the supplied fields
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function updateUser(ctx) {
    try {
        let user = ctx.state.user; // current user
        const id = parseInt(ctx.params.id); // record id from the url

        // Only admins and the owner
        const permission = can.update(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        /* filter the body using the permissions
         if a field is not allowed to be updated, it will be removed
         as admins and users can update different fields */
        let body = permission.filter(ctx.request.body);

        // hash the password if it is updated
        if (body.password) {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            body.password = hashedPassword;
        }

        // update the user
        let [result] = await model.update(id, body);
        if (result.affectedRows) { // If the user is updated successfully
            ctx.status = 200;
            ctx.body = { ID: id, link: `/api/v1/users/${id}` };
        } else {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update the user' };
    }
}

/** delete an existing user, must delete related address
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function deleteUser(ctx) {
    try {
        let user = ctx.state.user;
        const id = parseInt(ctx.params.id);

        // Only admins
        const permission = can.delete(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        // delete related addresses to prevent foreign key constraint error
        let [address] = await addressModel.getAll(id);
        if (address.length) {
            let [addressResult] = await addressModel.delete(address[0].id, id); // pass the address id and user id
        }

        // delete the user
        let [result] = await model.delete(id);
        if (result.affectedRows) {
            ctx.status = 204; // 204 No Content
            ctx.body = { message: 'User deleted' };
        } else {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500; // Internal Server Error
        ctx.body = { error: 'Failed to delete the user' };
    }
}

module.exports = router;
