/**
 * @module routes/orders
 * @description API routes for managing orders, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/orders
 * @requires models/products
 * @requires models/addresses
 * @requires controllers/auth
 * @requires permissions/orders
 * @requires controllers/validation
 * @see models/orders for db operations
 * @see controllers/auth for auth middleware
 * @see permissions/orders for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/orders');
const productModel = require('../models/products');
const addressModel = require('../models/addresses');
const auth = require('../controllers/auth');
const can = require('../permissions/orders');

// Import validation functions
const {validateOrder} = require('../controllers/validation');
const {validateOrderUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/orders'});

router.get('/', auth, getAllOrders);
router.post('/', auth, bodyParser(), validateOrder, createOrder);
router.get('/:orderId([0-9]{1,})', auth, getOrderById);
router.put('/:orderId([0-9]{1,})', auth, bodyParser(), validateOrderUpdate, updateOrder);
router.del('/:orderId([0-9]{1,})', auth, deleteOrder);


/** get all orders
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAllOrders(ctx) {
    try {
        let user = ctx.state.user; // current user
        let orders;

        const permission = can.read(user);
        
        if (!permission.granted) { // user gets their own orders
            [orders] = await model.getAll(user.id);
        } else if (permission.granted){ // admin gets all orders
            [orders] = await model.getAll();
        }

        if (orders.length) {
            ctx.body = orders;
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No orders found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve orders' };
    }
}

/** create a new order
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function createOrder(ctx) {
    try {
        let user = ctx.state.user; // current user

        // check permissions
        const permission = can.create(user);
        if (!permission.granted) {
            ctx.status = 403; // forbidden
            return;
        }

        const order = ctx.request.body;

        // validate order product id
        const [product] = await productModel.getById(order.product_id); // check if product exists
        if (!product.length) {
            ctx.status = 404;
            ctx.body = { error: 'Product not found' };
            return;
        } 

        // check if product is already sold
        if (product[0].sold) {
            ctx.status = 400; // bad request
            ctx.body = { error: 'Product has already sold' };
            return;
        }

        // get user address id
        const [address] = await addressModel.getAll(user.id);
        if (!address.length) {
            ctx.status = 404;
            ctx.body = { error: 'Address not found' };
            return;
        }

        order.total_price = product[0].price; // set total price
        order.user_id = user.id; // set user id
        order.address_id = address[0].id; // set address id

        // add order to db
        const [result] = await model.add(order);

        if (result) {
            // set sold attribute of product being ordered
            const [sold] = await productModel.updateSold(order.product_id);
            if (!sold.affectedRows) {
                ctx.status = 500;
                ctx.body = { error: 'Failed to update product' };
                return;
            }
            ctx.status = 201; // created
            order.id = result.insertId;
            ctx.body = {Order: order, link: `/api/v1/orders/${result.insertId}`}; // send back order information
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create order' };
    }
}

/** get a single order by its id
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function getOrderById(ctx) {
    try {
        let user = ctx.state.user; // current user
        const orderId = parseInt(ctx.params.orderId);
        let [order] = await model.getById(orderId);

        // only allow users to read their own orders
        const permission = can.read(user, order[0].user_id);
        if (!permission.granted) {
            ctx.status = 403;
            return;
        }

        if (order.length) {
            ctx.body = order[0];
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Order not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve order' };
    }
}

/** update an existing order with the supplied fields 
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function updateOrder(ctx) {
    try {
        let user = ctx.state.user; // current user
        const orderId = parseInt(ctx.params.orderId);

        const permission = can.update(user);
        if (!permission.granted) {
            ctx.status = 403;
            return;
        }

        const order = ctx.request.body;

        let [result] = await model.update(orderId, order);
        console.log(result);

        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = {Id: orderId, link: `/api/v1/categories/${orderId}`};
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Order not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update order' };
    }
}

/** delete an existing order
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function deleteOrder(ctx) {
    try {
        let user = ctx.state.user; // current user
        const orderId = parseInt(ctx.params.orderId);

        const permission = can.delete(user);
        if (!permission.granted) {
            ctx.status = 403;
            return;
        }

        let [result] = await model.delete(orderId);
        
        if (result.affectedRows) {
            ctx.status = 204;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Order not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete order' };
    }
}

module.exports = router;