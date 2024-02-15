const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const model = require('../models/users');
const auth = require('../controllers/auth');
const {validateUser} = require('../controllers/validation');
const {validateUserUpdate} = require('../controllers/validation');
const jwt = require('jsonwebtoken');

const router = Router({prefix: '/api/v1/users'});

router.get('/', auth, getAll);
router.post('/', bodyParser(), auth, validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

// get all users
async function getAll(ctx) {
    try {
        const page = parseInt(ctx.query.page, 10) || 1; //defaults are 1 and 10
        const limit = parseInt(ctx.query.limit, 10) || 10;
        const order = ctx.query.order;

        const [users] = await model.getAll(page, limit, order);
        
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

// get a single user by its id
async function getById(ctx) {
    try {
        let id = ctx.params.id;
        let [user] = await model.getById(id);

        // If an user is found, return it
        if (user.length) {
            ctx.body = user[0];
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

// create a new user in the database
async function createUser(ctx) {
    try {
        const body = ctx.request.body;

        const hashedPassword = await bcrypt.hash(body.password, 10); // 10 is the salt rounds
        body.password = hashedPassword;

        let [result] = await model.add(body);
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId}
        }
    } catch (error) {
        console.error(error.code);
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create the user' };
    }
}

// update an existing user with the supplied fields
async function updateUser(ctx) {
    try {
        let user = ctx.state.user; // current user
        const id = parseInt(ctx.params.id); // id from the url

        // Check if the user is the owner of the user
        if (user.id !== id) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'You are not allowed to update this user' };
            return;
        }

        const body = ctx.request.body;

        // hash the password if it is updated
        if (body.password) {  
            // hash the password
            const hashedPassword = await bcrypt.hash(body.password, 10); // 10 is the salt rounds
            body.password = hashedPassword;
        }

        // update the user
        let [result] = await model.update(id, body);
        if (result) { // If the user is updated successfully
            ctx.status = 200;
            ctx.body = {ID: id}
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update the user' };
    }
}

// delete an existing user
async function deleteUser(ctx) {
    try {
        let user = ctx.state.user;
        const id = parseInt(ctx.params.id);

        // Check if the user is the owner of the user
        if (user.ID !== id) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'You are not allowed to delete this user' };
            return;
        }

        // delete the user
        let result = await model.delete(id);
        if (result[0].affectedRows > 0) {
            ctx.status = 204; // 204 No Content
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
