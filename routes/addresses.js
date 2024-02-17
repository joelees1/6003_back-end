const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/addresses');
const auth = require('../controllers/auth');
const can = require('../permissions/addresses');

// Import validation functions
const {validateAddress} = require('../controllers/validation');
const {validateAddressUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/users/:id/address'});

router.get('/', auth, getAll); // get all of a users addresses
router.post('/', bodyParser(), auth, validateAddress, createAddress);
router.get('/:addressId([0-9]{1,})', auth, getById);
router.put('/:addressId([0-9]{1,})', auth, bodyParser(), validateAddressUpdate, updateAddress);
router.del('/:addressId([0-9]{1,})', auth, deleteAddress);

// get all of a users addresses
async function getAll(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.read(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        const [addresses] = await model.getAll(id); // get addresses belonging to the user
        
        // If addresses are found, return them
        if (addresses.length) {
            ctx.body = addresses;
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

// get a single address by its id belonging to a user
async function getById(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.read(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }
        
        let addressId = ctx.params.addressId;
        let [address] = await model.getById(addressId, id);

        // If an address is found, return it
        if (address.length) {
            ctx.body = address[0];
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

// create address
async function createAddress(ctx) {
    try {
        let id = parseInt(ctx.params.id) // url id
        let user = ctx.state.user; // current user

        const permission = can.create(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        // get the users last made address to check they are not making too many requests
        let [lastAddress] = await model.getLastAddress(id);
        if (lastAddress) {
            let now = new Date(); // current time
            const last = lastAddress[0].created_at; // last address created time
            let diff = now - last;

            if (diff < 60000) { // 60 seconds
                ctx.status = 429;
                ctx.body = { error: 'Too many requests, wait 1 minute' };
                return;
            }
        }

        const body = ctx.request.body;
        body.user_id = id;

        let [result] = await model.add(body); // create the address
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId}
        }
    } catch (error) {
        console.error(error.code);
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create address' };
    }
}

// update address
async function updateAddress(ctx) {
    try {
        let user = ctx.state.user; // current user
        const id = parseInt(ctx.params.id); // id from the url
        const addressId = ctx.params.addressId;

        const permission = can.update(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        const body = ctx.request.body;

        // update the address
        let [result] = await model.update(addressId, id, body);

        if (result.affectedRows) { // If the address is updated successfully
            ctx.status = 200;
            ctx.body = {ID: addressId}
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

// delete address
async function deleteAddress(ctx) {
    try {
        let user = ctx.state.user;
        const id = parseInt(ctx.params.id);
        const addressId = ctx.params.addressId;

        const permission = can.delete(user, id);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
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
        ctx.body = { error: 'Failed to delete address' };
    }
}

module.exports = router;