const request = require('supertest')
const app = require('../app')

const { tokens } = require('../config')

// Test the GetAllCategories route
describe('Get all categories', () => {
    // Test case: get all categories
    it('responds with all categories', async () => {
        const res = await request(app.callback())
            .get('/api/v1/categories')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('description');
        expect(res.body[0]).toHaveProperty('created_at');
        expect(res.body[0]).toHaveProperty('updated_at');
    })
})

// Test the GetCategoryById route
describe('Get category by id', () => {
    // Test case: get a category by its id as an admin
    it('responds with a single category', async () => {
        const res = await request(app.callback())
            .get('/api/v1/categories/1')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body).toHaveProperty('updated_at');
    })
    // Test case: get a category by its id as a user
    it('responds with a single category', async () => {
        const res = await request(app.callback())
            .get('/api/v1/categories/1')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: get a category by its id that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .get('/api/v1/categories/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
})

// Test the CreateCategory route
describe('Create category', () => {
    // Test case: create a new category as an admin
    it('responds with 201', async () => {
        const res = await request(app.callback())
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'New Category',
                description: 'New category description'
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: create a new category as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                name: 'New Category',
                description: 'New category description'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: create a new category without a name
    it('responds with 400', async () => {
        const res = await request(app.callback())
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                description: 'New category description'
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('details');
        expect(res.body).toHaveProperty('message');
    })
})

// Test the UpdateCategory route
describe('Update category', () => {
    // Test case: update a category
    it('responds with 200', async () => {
        const res = await request(app.callback())
            .put('/api/v1/categories/14')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'Updated Category',
                description: 'Updated category description'
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
    // Test case: update a category as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .put('/api/v1/categories/14')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
            .send({
                name: 'Updated Category',
                description: 'Updated category description'
            })
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: update a category that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .put('/api/v1/categories/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                name: 'Updated Category',
                description: 'Updated category description'
            })
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: update a category without a name, partial update support
    it('responds with 200', async () => {
        const res = await request(app.callback())
            .put('/api/v1/categories/14')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
            .send({
                description: 'Updated category description'
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('ID');
        expect(res.body).toHaveProperty('link');
    })
})

// Test the DeleteCategory route
describe('Delete category', () => {
    // Test case: delete a category
    it('responds with 204', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/categories/14')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(204)
    })
    // Test case: delete a category as a user
    it('responds with 403', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/categories/6')
            .set('Authorization', `Bearer ${tokens.exampleUserToken}`)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error');
    })
    // Test case: delete a category that does not exist
    it('responds with 404', async () => {
        const res = await request(app.callback())
            .delete('/api/v1/categories/0')
            .set('Authorization', `Bearer ${tokens.exampleAdminToken}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error');
    })
})