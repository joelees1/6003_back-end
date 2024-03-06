const request = require('supertest')
const app = require('../app')

const { tokens } = require('../config')

// Test GetAllAddresses route
describe('Get all addresses', () => {
    // Test case: get addresses of a user as an admin
    it('responds with all user 1 addresses', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id');
        expect(res.body).toHaveProperty('address_line1');
        expect(res.body).toHaveProperty('address_line2');
        expect(res.body).toHaveProperty('city');
        expect(res.body).toHaveProperty('postcode');
        expect(res.body).toHaveProperty('country');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body).toHaveProperty('updated_at');
    })
    // Test case: get all addresses as a user
    it('responds with address of user_id of 1 (user)', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id');
        expect(res.body).toHaveProperty('address_line1');
        expect(res.body).toHaveProperty('address_line2');
        expect(res.body).toHaveProperty('city');
        expect(res.body).toHaveProperty('postcode');
        expect(res.body).toHaveProperty('country');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body).toHaveProperty('updated_at');
    })
    // Test case: get address of another user as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/2/address')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: get addresses of a user that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/0/address')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: unauthenticated user
    it('responds with 401', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address')
        expect(res.status).toBe(401)
    })
})

// Test GetAddressById route
describe('Get address by id', () => {
    // Test case: get an address by its id as an admin
    it('responds with a single address', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id');
        expect(res.body).toHaveProperty('address_line1');
        expect(res.body).toHaveProperty('address_line2');
        expect(res.body).toHaveProperty('city');
        expect(res.body).toHaveProperty('postcode');
        expect(res.body).toHaveProperty('country');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body).toHaveProperty('updated_at');
    })
    // Test case: get an address by its id as a user
    it('responds with a single address', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id');
        expect(res.body).toHaveProperty('address_line1');
        expect(res.body).toHaveProperty('address_line2');
        expect(res.body).toHaveProperty('city');
        expect(res.body).toHaveProperty('postcode');
        expect(res.body).toHaveProperty('country');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body).toHaveProperty('updated_at');
    })
    // Test case: get an address by its id that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: get an address by its id that does not exist as a user
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/users/1/address/0')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })

})

// Test CreateAddress route
describe('Create address', () => {
    // Test case: create a new address as a user for another user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users/100/address')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                address_line1: 'New Address',
                address_line2: 'New address description',
                city: 'New City',
                postcode: 'New Postcode',
                country: 'New Country'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: create a new address
    it('responds with 201', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users/100/address')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                address_line1: 'New Address',
                address_line2: 'New address description',
                city: 'New City',
                postcode: 'New Postcode',
                country: 'New Country'
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: create a new address when one already exists
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users/1/address')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                address_line1: 'New Address',
                address_line2: 'New address description',
                city: 'New City',
                postcode: 'New Postcode',
                country: 'New Country'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // unauthenticated user
    it('responds with 401', async () => {
        const res = await request(app.callback())
            .post('/api/v1/users/1/address')
            .send({
                address_line1: 'New Address',
                address_line2: 'New address description',
                city: 'New City',
                postcode: 'New Postcode',
                country: 'New Country'
            })
        expect(res.status).toBe(401)
    })
})

// Test UpdateAddress route
describe('Update address', () => {
    // Test case: update own address as a user
    it('responds with 200', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1/address/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                address_line1: 'Updated Address',
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: update an address as an admin
    it('responds with 200', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1/address/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                address_line2: 'Updated address description'
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: update an address that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1/address/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                address_line1: 'Updated Addressss'
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: update another users address as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/2/address/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`) // user id 1
            .send({
                address_line1: 'Updated Address'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // unauthenticated user
    it('responds with 401', async () => {
        const res = await request(app.callback())
            .put('/api/v1/users/1/address/1')
            .send({
                address_line1: 'Updated Address'
            })
        expect(res.status).toBe(401)
    })
})

// Test DeleteAddress route
describe('Delete address', () => {
    // Test case: delete an address as an admin
    it('responds with 204', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/105/address/33')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(204)
    })
    // Test case: delete an address that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/1/address/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: delete another users address as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/2/address/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`) // user id 1
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // unauthenticated user
    it('responds with 401', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/users/1/address/1')
        expect(res.status).toBe(401)
    })
})