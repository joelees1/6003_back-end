const request = require('supertest')
const app = require('../app')

const { tokens } = require('../config')

// Test the GetAllOrders route
describe('Get all orders', () => {
    // Test case: get all orders as an admin
    it('responds with all orders', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('user_id');
        expect(res.body[0]).toHaveProperty('product_id');
        expect(res.body[0]).toHaveProperty('total_price');
        expect(res.body[0]).toHaveProperty('status');
        expect(res.body[0]).toHaveProperty('address_id');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    })
    // Test case: get all orders as a user, should only get own orders
    it('responds with all orders with user_id of 1 (user)', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('user_id');

        // Ensure every order has user_id equal to 1
        const allOrdersMatchUserId = res.body.every(order => order.user_id === 1);
        expect(allOrdersMatchUserId).toBe(true);
        
        expect(res.body[0]).toHaveProperty('product_id');
        expect(res.body[0]).toHaveProperty('total_price');
        expect(res.body[0]).toHaveProperty('status');
        expect(res.body[0]).toHaveProperty('address_id');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    })
})

// Test the CreateOrder route
describe('Create order', () => {
    // Test case: create a new order
    it('responds with 201', async () => {
        const res = await request(app.callback())
            .post('/api/v1/orders')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                product_id: 29
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('Order');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: create a new order with a non existing product
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .post('/api/v1/orders')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                product_id: 0
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: create a new order with a product that is already sold
    it('responds with 400', async () => {
        const res = await request(app.callback())
            .post('/api/v1/orders')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                product_id: 27
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the GetOrderById route
describe('GET single order', () => {
    // Test case: get a single order by its id
    it('responds with single order', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
    })
    // get a non existing order
    it('responds with 404 not found', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // get non owned order as a user
    it('responds with 403 forbidden', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders/8')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // get owned order as a user
    it('responds with single order', async () => {
        const res = await request(app.callback())
            .get('/api/v1/orders/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
    })
})

// Test the UpdateOrder route
describe('Update order status', () => {
    // Test case: update order as an admin
    it('responds with 200', async () => {
        const res = await request(app.callback())
            .put('/api/v1/orders/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                status: 'shipped'
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('Id');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: update order status with invalid status
    it('responds with 400', async () => {
        const res = await request(app.callback())
            .put('/api/v1/orders/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                status: 'invalid status'
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('details');
        expect(res.body).toHaveProperty('message');
    })
    // Test case: update non existing order
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .put('/api/v1/orders/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                status: 'shipped'
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: update order status with non owned order
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .put('/api/v1/orders/8')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                status: 'shipped'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the DeleteOrder route
describe('Delete order', () => {
    // Test case: delete order as an admin
    it('responds with 204 no content', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/orders/18')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(204)
    })
    // Test case: delete non existing order
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/orders/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: delete non owned order
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/orders/8')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
})