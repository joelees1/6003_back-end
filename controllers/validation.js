const { Validator, ValidationError } = require('jsonschema');

const { user: userSchema, userUpdate: userUpdateSchema } = require('../schemas/user.json').definitions;
const { address: addressSchema, addressUpdate: addressUpdateSchema } = require('../schemas/address.json').definitions;
const { product: productSchema, productUpdate: productUpdateSchema } = require('../schemas/product.json').definitions;

const v = new Validator();

// create user validation schema
exports.validateUser = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, userSchema, validationOptions); // Validate against user schema
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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

// update user validation schema
exports.validateUserUpdate = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, userUpdateSchema, validationOptions); // Validate against user update schema
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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

// create address validation
exports.validateAddress = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, addressSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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

// update address validation
exports.validateAddressUpdate = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, addressUpdateSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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

// create product validation
exports.validateProduct = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, productSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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

// update product validation
exports.validateProductUpdate = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;

    try {
        v.validate(body, productUpdateSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            // Extract error details
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