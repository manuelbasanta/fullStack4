const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Creating users', () => {
    test('invalid users can not be added', async () => {

        const initialUsers = await api.get('/api/users');
        
        const tooShort = {
            password: "g",
            username: "P",
            name: "Pepe"
        }

        const missingPass = {
            username: "Peter",
            name: "joseph"
        }

        const result = await api
            .post(`/api/users/`)
            .send(tooShort)
            .expect(400)

        expect(result.body.error).toContain('is shorter than the minimum allowed length')
        
        const result2 = await api
            .post(`/api/users/`)
            .send(missingPass)
            .expect(400)

        expect(result2.body.error).toContain('invalid password')

        const usersAtEnd = await api.get('/api/users');
    
        expect(usersAtEnd.body.length).toBe(
            initialUsers.body.length
        )

    }, 30000)

})

afterAll(() => {
    mongoose.connection.close()
})