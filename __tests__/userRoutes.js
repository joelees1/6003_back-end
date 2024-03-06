const request = require('supertest')
const app = require('../app')
const { tokens } = require('../config') // example json tokens
const Ajv = require('ajv'); 

// Import the user schema from the ../schemas/user.json file in the schema definitions
const userSchema = require('../schemas/user.json');

const ajv = new Ajv(); 
// ** cant get ajv to recognise email format **
//const validate = ajv.compile(userSchema.definitions.user);


// Test the GetAll Users route
describe('Get all users', () => {
    // test for general validity
    it('should return all users', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('role');
        expect(res.body[0]).toHaveProperty('username');
        expect(res.body[0]).toHaveProperty('first_name');
        expect(res.body[0]).toHaveProperty('last_name');
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).toHaveProperty('phone_number');
        expect(res.body[0]).toHaveProperty('created_at');
    })
    // test for authorisation
    it('should return a 401 error if not authorised', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users'); // No authorisation header
        expect(res.statusCode).toEqual(401);
    });
    // test for admin access only
    it('should return a 403 error if not an admin', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
    });
});

// Test the GET User by ID route
describe('Get user by ID', () => {
    // test for admin access
    it('should return a user by id', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('role');
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('first_name');
        expect(res.body).toHaveProperty('last_name');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('phone_number');
        expect(res.body).toHaveProperty('created_at');
    })
    // test for user accessing own record
    it('should return a user by id', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1') // User 1 is the example user
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('first_name');
        expect(res.body).toHaveProperty('last_name');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('phone_number');
        expect(res.body).toHaveProperty('created_at');
    })
    // test for authorisation
    it('should return a 401 error if not authorised', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1'); // No authorisation header
        expect(res.statusCode).toEqual(401);
    });
    // test for admin access only to other users
    it('should return a 403 error if not an admin', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/2') // not the example user id
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
    });
    // test for user not found
    it('should return a 404 error if user not found', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/9999999')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });
});

// Test the POST User route
describe('Post new user', () => {
    // test valid user creation
    it('should create a new user', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users')
            .send({
                username: 'unique_112233',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@gmail.com',
                password: 'password',
                phone_number: '07780536565'
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('ID')
        expect(res.body).toHaveProperty('link')
    })
    // test for missing fields
    it('should return a 400 error if missing fields', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users')
            .send({
                username: 'unique_112233',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe2@gmail.com',
                password: 'password'
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })
    // test for duplicate username
    it('should return a 400 error if username is not unique', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users')
            .send({
                username: 'unique_112233',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe2@gmail.com',
                password: 'password',
                phone_number: '07780536565'
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })
    // test for invalid email
    /*it('should return a 400 error if email is invalid', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users')
            .send({
                username: 'unique_112233',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe2gmail.com',
                password: 'password',
                phone_number: '07780536565'
            })
        expect(res.statusCode).toEqual(400)

        // Validate against full 'user' schema
        const valid = validate(res.body);
        expect(valid).toBe(false);
    })*/
});

// Test the PUT User route
describe('Update user', () => {
    // test for valid user update
    it('should update a user', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe3@gmail.com',
                phone_number: '07780536565'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('ID')
        expect(res.body).toHaveProperty('link')
    })
    // test for authorisation
    it('should return a 401 error if not authorised', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1') // No authorisation header
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe3@gmail.com',
                phone_number: '07780536565'
            })
        expect(res.statusCode).toEqual(401);
    })
    // test for admin access only to other users
    it('should return a 403 error if not an admin', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/2')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                first_name: 'John',
                last_name: 'Doe'
            })
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
    })
    // test for user not found
    it('should return a 404 error if user not found', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/9999999')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                first_name: 'John',
                last_name: 'Doe'
            })
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    })
});

// Test the DELETE User route
describe('Delete user', () => {
    // test for valid user deletion using admin,
    // cant use a user with orders as they are not deleted
    it('should delete a user', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/100')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.statusCode).toEqual(204)
    })
    // test for authorisation
    it('should return a 401 error if not authorised', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/1') // No authorisation header
        expect(res.statusCode).toEqual(401);
    })
    // test for admin access only
    it('should return a 403 error if not an admin', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
    })
    // test for user not found
    it('should return a 404 error if user not found', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/9999999')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    })
});