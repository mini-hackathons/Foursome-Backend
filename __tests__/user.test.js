const request   = require('supertest');
const app       = require('../app');
const connectDB = require('../database');
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/closet-test';

let cookie;

describe('Test logged in user paths', () => {
    // CONNECT
    beforeAll(async () => {
        await connectDB(MONGO_PATH);
    });
    
    // CREATE
    it('should create a user', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-user')
            .send({
                email: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');
            
        expect(response.statusCode).toBe(201);
    });
    it('should fail to create a duplicate user', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-user')
            .send({
                email: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');  

        expect(response.status).toBe(409);            
    });

    // FAIL TO DELETE ACCOUNT BEFORE LOGIN
    it('should fail to delete a user without cookie', async () => {
        expect.assertions(1);

        const response = await request(app).delete('/delete-user')
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

    // READ ALL USERS
    it('should get all users', async () => {
        expect.assertions(1);

        const response = await request(app).get('/all-users')
        expect(response.statusCode).toBe(200);
    });
    
    // DELETE ACCOUNT
    it('should delete a user', async () => {
        expect.assertions(1);

        const response = await request(app).delete('/delete-user')
            .set('Cookie', cookie);
        expect(response.statusCode).toBe(200);
    });

    // LOGOUT
    it('should logout a user', async (done) => {
        expect.assertions(1);

        const response = await request(app).post('/logout')
            .set('Cookie', cookie);
        expect(response.statusCode).toBe(200);

        done();
    });
});