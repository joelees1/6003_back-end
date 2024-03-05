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
const mime = require('mime-types');
const { copyFileSync, existsSync, createReadStream, unlinkSync } = require('fs');
const { v4: uuidv4 } = require('uuid');
const model = require('../models/products');
const auth = require('../controllers/auth');
const can = require('../permissions/products');

const path = require('path'); 
const uploadsDir = path.join(__dirname, '..', 'uploads'); // Absolute path
const imageDir = path.join(__dirname, '..', 'productImages'); // Absolute path
const koaBody = require('koa-body')({
    multipart: true,
    formidable: { uploadsDir}
});

// Import validation functions
const {validateProduct} = require('../controllers/validation');
const {validateProductUpdate} = require('../controllers/validation');
const prefix = '/api/v1/products';
const router = Router({prefix: prefix});


router.get('/', getAllProducts); // no auth
router.post('/', koaBody, auth, validateProduct, createProduct); // auth
router.get('/:productId([0-9]{1,})', getProductById); // no auth
router.get('/:productId([0-9]{1,})/image', getProductImageById); // no auth
router.put('/:productId([0-9]{1,})', auth, bodyParser(), validateProductUpdate, updateProduct); // auth
router.del('/:productId([0-9]{1,})', auth, deleteProduct); // auth


/** get all products
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function getAllProducts(ctx) {
    try {
        //const page = parseInt(ctx.query.page, 10) || 1; // defaults are 1 and 10
        //const limit = parseInt(ctx.query.limit, 10) || 12;
        //const order = ctx.query.order;
        //const category = parseInt(ctx.query.category); // category filter

        const [products] = await model.getAll(); //page, limit, order, category

        if (products.length) {
            // extract only the product fields needed for the home page
            const body = products.map(product => {
                const { id, name, description, creator, sold, category_id } = product;
                //const links = { self: `/products/${id}`, image: `/products/${id}/image` };
                const links = { 
                    self: `${ctx.protocol}://${ctx.host}${prefix}/${id}`,
                    image: `${ctx.protocol}://${ctx.host}${prefix}/${id}/image`
                };

                return { id, name, description, creator, sold, category_id, links };
            });
            ctx.body = body;
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
 * @returns {object} - The Koa response object with the product details
 */
async function getProductById(ctx) {
    try {
        let productId = parseInt(ctx.params.productId) // url id
        let [product] = await model.getById(productId);

        // If a product is found, return it
        if (product.length) {
            // add links to the response
            product[0].links = {
                self: `${ctx.protocol}://${ctx.host}${prefix}/${productId}`,
                image: `${ctx.protocol}://${ctx.host}${prefix}/${productId}/image`
            };
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

/** get a products image by id 
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object with the image
*/
async function getProductImageById(ctx) {
    const productId = parseInt(ctx.params.productId);
    let [product] = await model.getById(productId);

    if (product.length) {
        const imagePath = product[0].image_url;
        if (existsSync(imagePath)) {
            ctx.type = 'image/png'; // Or the appropriate image type
            ctx.body = createReadStream(imagePath);
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Image not found' };
        } 
    } else { 
        ctx.status = 404;
        ctx.body = { error: 'Product not found' };
    }
}

/** create a new product
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
 */
async function createProduct(ctx) {
    try {
        //let user = ctx.state.user; // current user
        const permission = can.create(user);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            return;
        }

        // image upload
        const { path, name, type } = ctx.request.files.image_url;
        const extension = mime.extension(type);

        console.log('Uploaded file details:')
        console.log(`path: ${path}`);
        console.log(`filename: ${name}`);
        console.log(`type: ${type}`);
        console.log(`extension: ${extension}`);

        const imageName = uuidv4()
        const newPath = `${imageDir}/${imageName}`; // .${extension}
        copyFileSync(path, newPath);

        // get the product details from the body
        const body = ctx.request.body;
        body.image_url = newPath;

        // make price and category integers
        body.price = parseInt(body.price);
        body.category_id = parseInt(body.category_id);

        let [result] = await model.add(body); // create the product
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId, link: `/products/${result.insertId}`};
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
        console.log(user);
        const productId = ctx.params.productId;

        const permission = can.update(user);
        console.log(permission);
        if (!permission.granted) {
            ctx.status = 403; // Forbidden
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const body = ctx.request.body;
        let [result] = await model.update(productId, body);

        if (result.affectedRows) { // If product is updated successfully
            ctx.status = 200;
            ctx.body = {id: productId}
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

        // delete product image and then from the db
        let [product] = await model.getById(productId);
        if (!product.length) {
            ctx.status = 404;
            ctx.body = { error: 'Product not found' };
            return;
        }
        const imagePath = product[0].image_url;

        let [result] = await model.delete(productId);
        if (result.affectedRows) {
            ctx.status = 204; // 204 No Content
            if (existsSync(imagePath)) {
                console.log('deleting image');
                // delete image
                unlinkSync(imagePath);
            }
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