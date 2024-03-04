/**
 * @module routes/categories
 * @description Admin API routes for managing categories, providing CRUD operations along with authorization enforcement.
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires models/categories
 * @requires controllers/auth
 * @requires permissions/categories
 * @requires controllers/validation
 * @see models/categories for db operations
 * @see controllers/auth for auth middleware
 * @see permissions/categories for permissions
 * @see controllers/validation for validation functions
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/categories');
const auth = require('../controllers/auth');
const can = require('../permissions/categories');

// Import validation functions
const {validateCategory} = require('../controllers/validation');
const {validateCategoryUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/categories'});

router.get('/', auth, getAllCategories);
router.post('/', bodyParser(), auth, validateCategory, createCategory);
router.get('/:categoryId([0-9]{1,})', auth, getCategoryById);
router.put('/:categoryId([0-9]{1,})', bodyParser(), auth, validateCategoryUpdate, updateCategory);
router.del('/:categoryId([0-9]{1,})', auth, deleteCategory);


/** get all categories
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function getAllCategories(ctx) {
    try {
        let user = ctx.state.user; // current user

        const permission = can.read(user);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const [categories] = await model.getAll();

        if (categories.length) {
            ctx.body = categories;
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'No categories found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve categories' };
    }
}

/** get a single category by its id
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function getCategoryById(ctx) {
    try {
        let user = ctx.state.user; // current user
        const categoryId = parseInt(ctx.params.categoryId);

        const permission = can.read(user);
        if (!permission.granted) {
            ctx.status = 403;
            return;
        }

        let [category] = await model.getById(categoryId);

        if (category.length) {
            ctx.body = category[0];
            ctx.status = 200;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Category not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to retrieve category' };
    }
}

/** create a new category in the database
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function createCategory(ctx) {
    try {
        let user = ctx.state.user; // current user

        const permission = can.create(user);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const body = ctx.request.body;

        let [result] = await model.add(body); // create the category
        if (result) {
            ctx.status = 201;
            ctx.body = {ID: result.insertId, link: `/api/v1/categories/${result.insertId}`};
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to create category' };
    }
}

/** update an existing category with the supplied fields
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function updateCategory(ctx) {
    try {
        let user = ctx.state.user; // current user
        const categoryId = parseInt(ctx.params.categoryId);

        const permission = can.update(user);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        const body = ctx.request.body;
        let [result] = await model.update(categoryId, body);

        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = {ID: categoryId, link: `/api/v1/categories/${categoryId}`};
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Product not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to update category' };
    }
}

/** delete a category
 * @param {object} ctx - The Koa request context object
 * @returns {object} - The Koa response object
*/
async function deleteCategory(ctx) {
    try {
        let user = ctx.state.user; // current user
        const categoryId = parseInt(ctx.params.categoryId);

        const permission = can.delete(user);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'Permission denied' };
            return;
        }

        let [result] = await model.delete(categoryId);

        if (result.affectedRows) {
            ctx.status = 204;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Category not found' };
        }
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete category' };
    }
}

module.exports = router;
