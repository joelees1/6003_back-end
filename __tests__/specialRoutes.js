const request = require('supertest')
const app = require('../app')

// Test the login route
describe('login route', () => {
    it('should return a 200 status and a token', async () => {
        const res = await request(app.callback())
            .post('/api/v1/login')
            .set('Authorization', "Bearer " + btoa(`admin:password`))
        expect(200)
        expect(res.body).toHaveProperty('token')
    })
    it('should return a 401 status for invalid credentials', async () => {
        const res = await request(app.callback())
            .post('/api/v1/login')
            .set('Authorization', "Bearer " + btoa(`admin:wrongpassword`))
        expect(401)
        expect(res.body).toHaveProperty('error')
    })
    it('should return a 400 status for missing credentials', async () => {
        const res = await request(app.callback())
            .post('/api/v1/login')
            .set('Authorization', "Bearer " + btoa(``))
        expect(400)
    })
})
