/**
 * @module routes/addresses
 * @description API routes for managing addresses associated with a user, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/addresses
 * @requires controllers/auth
 * @requires permissions/addresses
 * @requires controllers/validation
 * @see models/addresses for db operations
 * @see controllers/auth for auth middleware
 * @see permissions/addresses for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/addresses');
const auth = require('../controllers/auth');
const can = require('../permissions/addresses');

// Import validation functions
const {validateAddress} = require('../controllers/validation');
const {validateAddressUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/users/:id/address'});

router.get('/', auth, getAllAddresses);
router.post('/', bodyParser(), auth, validateAddress, createAddress);
router.get('/:addressId([0-9]{1,})', auth, getAddressById);
router.put('/:addressId([0-9]{1,})', auth, bodyParser(), validateAddressUpdate, updateAddress);
router.del('/:addressId([0-9]{1,})', auth, deleteAddress);


/** get the addresses belonging to a user passed in the url
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAllAddresses(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.read(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const [addresses] = await model.getAll(id); // get addresses belonging to the user

        // If addresses are found, return them
        if (addresses.length) {
            ctx.body = addresses[0];
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No addresses found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve addresses' };
    }
}

/** get a single address by its id
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAddressById(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.read(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }
        
        let addressId = ctx.params.addressId; // address id from the url
        let [address] = await model.getById(addressId, id);

        // If an address is found, return it
        if (address.length) {
            ctx.body = address[0];
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'address not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve the address' };
    }
}

/** create a new address in the database
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function createAddress(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.create(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        // only allow a user to have 1 address
        let [addresses] = await model.getAll(id);
        if (addresses.length) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'User already has an address' };
            return;
        }

        const body = ctx.request.body;
        body.user_id = id;

        let [result] = await model.add(body); // create the address
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId, link: `/api/v1/users/${id}/address/${result.insertId}`};
        }
    } catch (error) {
        console.error(error.code);
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create address' };
    }
}

/** update an existing address with the supplied fields
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function updateAddress(ctx) {
    try {
        let user = ctx.state.user; // current user
        const id = parseInt(ctx.params.id); // id from the url
        const addressId = ctx.params.addressId;

        const permission = can.update(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const body = ctx.request.body;

        // update the address
        let [result] = await model.update(addressId, id, body);

        if (result.affectedRows) { // If the address is updated successfully
            ctx.status = 200;
            ctx.body = {ID: addressId, link: `/api/v1/users/${id}/address/${addressId}`};
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Address not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update address' };
    }
}

/** delete an existing address
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function deleteAddress(ctx) {
    try {
        let user = ctx.state.user;
        const id = parseInt(ctx.params.id);
        const addressId = ctx.params.addressId;

        const permission = can.delete(user, id);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        let [result] = await model.delete(addressId, id); // delete the address
        if (result.affectedRows) {
            ctx.status = 204; // 204 No Content
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Address not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500; // Internal Server Error
        ctx.body = { error: 'Failed to delete address, check orders associated with address' };
    }
}

module.exports = router;