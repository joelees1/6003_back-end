/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Joseph
 * @see schemas/* for JSON Schema definition files
 */

const { Validator, ValidationError } = require('jsonschema');

const { user: userSchema, userUpdate: userUpdateSchema } = require('../schemas/user.json').definitions;
const { address: addressSchema, addressUpdate: addressUpdateSchema } = require('../schemas/address.json').definitions;
const { product: productSchema, productUpdate: productUpdateSchema } = require('../schemas/product.json').definitions;
const { category: categorySchema, categoryUpdate: categoryUpdateSchema } = require('../schemas/category.json').definitions;
const { order: orderSchema, orderUpdate: orderUpdateSchema } = require('../schemas/order.json').definitions;
const { login: loginSchema } = require('../schemas/login.json').definitions;

const v = new Validator();

/** Validation function 
 * @param {Object} ctx - Koa context object
 * @param {Function} next - Koa next function
 * @param {Object} schema - JSON Schema definition
 * @returns {Promise} - Koa next function
 * @throws {ValidationError} - Koa context object
*/
async function validate(ctx, next, schema) {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, schema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            const errorMessage = {
                message: 'Validation Error',
                details: error.message
            };
            ctx.body = errorMessage;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/** create user validation schema */
exports.validateUser = async (ctx, next) => {
    await validate(ctx, next, userSchema)
}

/** update user validation schema */
exports.validateUserUpdate = async (ctx, next) => {
    await validate(ctx, next, userUpdateSchema)
}

/** create address validation */
exports.validateAddress = async (ctx, next) => {
    await validate(ctx, next, addressSchema)
}

/** update address validation */
exports.validateAddressUpdate = async (ctx, next) => {
    await validate(ctx, next, addressUpdateSchema)
}

/** create product validation */
exports.validateProduct = async (ctx, next) => {
    await validate(ctx, next, productSchema)
}

/** update product validation */
exports.validateProductUpdate = async (ctx, next) => {
    await validate(ctx, next, productUpdateSchema)
}

/** create category validation */
exports.validateCategory = async (ctx, next) => {
    await validate(ctx, next, categorySchema)
}

/** update category validation */
exports.validateCategoryUpdate = async (ctx, next) => {
    await validate(ctx, next, categoryUpdateSchema)
}

/** create order validation */
exports.validateOrder = async (ctx, next) => {
    await validate(ctx, next, orderSchema)
}

/** update order validation */
exports.validateOrderUpdate = async (ctx, next) => {
    await validate(ctx, next, orderUpdateSchema)
}

/** login validation */
exports.validateLogin = async (ctx, next) => {
    await validate(ctx, next, loginSchema)
}
