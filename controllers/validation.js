const { Validator, ValidationError } = require('jsonschema');
const userSchema = require('../schemas/user.schema.js');
const userUpdateSchema = require('../schemas/userUpdate.schema.js');
const addressSchema = require('../schemas/address.schema.js');
const addressUpdateSchema = require('../schemas/addressUpdate.schema.js');
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
        v.validate(body, addressSchema, validationOptions); // Validate against user update schema
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
        v.validate(body, addressUpdateSchema, validationOptions); // Validate against user update schema
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