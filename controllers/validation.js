const { Validator, ValidationError } = require('jsonschema');
const userSchema = require('../schemas/user.schema.js');
const userUpdateSchema = require('../schemas/userUpdate.schema.js');
const v = new Validator();

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

exports.validateUserUpdate = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };

    const body = ctx.request.body;
    console.log(body);

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