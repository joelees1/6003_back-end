const request = require('supertest')
const app = require('../app')

const { tokens } = require('../config')

// Test the GetAllProducts route
describe('Get all products', () => {
    // Test case: get all products
    it('responds with all products', async () => {
        const res = await request(app.callback())
            .get('/api/v1/products')
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('description');
        expect(res.body[0]).toHaveProperty('creator');
        expect(res.body[0]).toHaveProperty('sold');
        expect(res.body[0]).toHaveProperty('category_id');
        expect(res.body[0]).toHaveProperty('links');
    })
})

// Test the GetProductById route
describe('GET single product', () => {
    // Test case: get a single product by its id
    it('responds with product', async () => {
        const res = await request(app.callback())
            .get('/api/v1/products/32')
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
    })
    // get a non existing product
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/products/0')
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the GetProductImageById route
describe('GET product image', () => {
    // Test case: get a product image by id
    it('responds with product image', async () => {
        const res = await request(app.callback())
            .get('/api/v1/products/28/image')
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Buffer);
    })
    // get a non existing product image
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/products/0/image')
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the CreateProduct route
describe('POST product', () => {
    // Test case: create a new product
    // cant send image in test
    /*it('responds with 201 and product link', async () => {
        const res = await request(app.callback())
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'test product',
                description: 'test description',
                creator: 'test creator',
                price: 100,
                image_url: 'test image url',
                category_id: 1
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('Links');
    })*/
    // create a product with missing data
    it('responds with json schema validation error', async () => {
        const res = await request(app.callback())
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'test product',
                description: 'test description',
                creator: 'test creator'
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('details');
        expect(res.body).toHaveProperty('message');
    })
})

// Test the UpdateProduct route
describe('PUT product', () => {
    // Test case: update a product
    it('responds with 200, and updated id', async () => {
        const res = await request(app.callback())
            .put('/api/v1/products/29')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'test product',
                description: 'test description',
                creator: 'test creator',
                price: 100,
                category_id: 1
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
    })
    // update a non existing product
    it('responds with 404 as prodcut doesnt exist', async () => {
        const res = await request(app.callback())
            .put('/api/v1/products/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'test product',
                description: 'test description',
                creator: 'test creator',
                price: 100,
                category_id: 1
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // update a product without admin token
    it('responds with 403 as forbidden', async () => {
        const res = await request(app.callback())
            .put('/api/v1/products/29')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                name: 'test product',
                description: 'test description',
                creator: 'test creator',
                price: 100,
                category_id: 1
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the DeleteProduct route
describe('DELETE product', () => {
    // Test case: delete a product
    it('responds with 204 product deleted', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/products/32')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(204)
    })
    // delete a non existing product
    it('responds with 404 not found', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/products/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // delete a product without admin token
    it('responds with 403 forbidden', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/products/32')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
})