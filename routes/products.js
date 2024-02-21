/**
 * @module routes/products
 * @description API routes for managing products, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/products
 * @requires models/products
 * @requires models/addresses
 * @requires controllers/auth
 * @requires permissions/products
 * @requires controllers/validation
 * @see models/products for db operations
 * @see controllers/auth for auth middleware
 * @see permissions/products for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/products');
const auth = require('../controllers/auth');
const can = require('../permissions/products');

// Import validation functions
const {validateProduct} = require('../controllers/validation');
const {validateProductUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/products'});

router.get('/', getAllProducts); // no auth
router.post('/', bodyParser(), auth, validateProduct, createProduct);
router.get('/:productId([0-9]{1,})', getProductById); // no auth
router.put('/:productId([0-9]{1,})', auth, bodyParser(), validateProductUpdate, updateProduct);
router.del('/:productId([0-9]{1,})', auth, deleteProduct);


/** get all products
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAllProducts(ctx) {
    try {
        const page = parseInt(ctx.query.page, 10) || 1; // defaults are 1 and 10
        const limit = parseInt(ctx.query.limit, 10) || 10;
        const order = ctx.query.order;
        const category = parseInt(ctx.query.category); // category filter

        const [products] = await model.getAll(page, limit, order, category);

        // If products are found, return them
        if (products.length) {
            ctx.body = products;
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No items found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve items' };
    }
}

/** get a single product by its id
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getProductById(ctx) {
    try {
        let productId = parseInt(ctx.params.productId) // url id
        
        let [product] = await model.getById(productId);

        // If a product is found, return it
        if (product.length) {
            ctx.body = product[0];
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'item not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve the item' };
    }
}

/** create a new product
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function createProduct(ctx) {
    try {
        let user = ctx.state.user; // current user

        const permission = can.create(user);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        const body = ctx.request.body;

        let [result] = await model.add(body); // create the product
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId, link: `/api/v1/products/${result.insertId}`};
        }
    } catch (error) {
        console.error(error.code);
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create item' };
    }
}

/** update an existing product with the supplied fields
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function updateProduct(ctx) {
    try {
        let user = ctx.state.user; // current user
        const productId = ctx.params.productId;

        const permission = can.update(user);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        const body = ctx.request.body;
        let [result] = await model.update(productId, body);

        if (result.affectedRows) { // If product is updated successfully
            ctx.status = 200;
            ctx.body = {ID: productId}
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Product not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update product' };
    }
}

/** delete an existing product
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function deleteProduct(ctx) {
    try {
        let user = ctx.state.user;
        const productId = ctx.params.productId;

        const permission = can.delete(user);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        let [result] = await model.delete(productId);
        
        if (result.affectedRows) {
            ctx.status = 204; // 204 No Content
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Product not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500; // Internal Server Error
        ctx.body = { error: 'Failed to delete product' };
    }
}

module.exports = router;