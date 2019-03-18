const request   = require('supertest');
const app       = require('../app');
const connectDB = require('../database');
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/closet-test';

let cookie;

describe('Test logged in user ITEM paths', () => {
    // CONNECT AND CREATE USER
    beforeAll(async () => {
        await connectDB(MONGO_PATH);

        // Create user
        await request(app)
            .post('/create-user')
            .send({
                email: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');
    });
    
    // FAIL TO CREATE ITEM BEFORE LOGIN
    it('should fail to create an item', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                name: 'NewItem',
                description: 'A new item',
                price: 12
            })
            
        expect(response.statusCode).toBe(401);
    });

    // LOGIN
    it('should login NewGuy!', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/login')
            .send({
                username: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');
        
        const cookies = response.header['set-cookie'][0].split(',').map(item => item.split(';')[0]);
        cookie = cookies.join(';');

        // expect(response.body).toEqual("Successully signed in!");
        expect(response.statusCode).toBe(200);
    });

    // CREATE ITEM
    it('should create an item', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                name: 'NewItem',
                description: 'A new item',
                price: 12
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(201);
    });

    // LOGOUT
    afterAll(async (done) => {
        const response = await request(app).post('/logout')
            .set('Cookie', cookie);
        expect(response.statusCode).toBe(200);

        done();
    });
});