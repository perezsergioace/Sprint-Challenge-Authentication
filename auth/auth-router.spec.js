const Users = require('./authModel');
const db = require('../database/dbConfig');
const server = require('../api/server');
const request = require('supertest');

describe('auth-model, auth-router', function() {
    beforeEach(async () => {
        await db('users').truncate();
    })

    describe('/api/auth/register', function() {
        it('should add users to the DB', async function() {
            await Users.add({ username: 'Sergio', password: 'password' })
            await Users.add({ username: 'new user', password: 'password' })

            const users = await db('users')
            expect(users).toHaveLength(2);
        })
    })

    it('should return status code 201', function() {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'Sergio', password: "password"})
            .then(response => {
                expect(response.status).toBe(201)
            })
    })

    describe('/api/auth/login', function() {
        it('should return status code 200 when registering', function() {
            return request(server)
                .post('/api/auth/register')
                .send({ username: 'new user', password: 'password'})
                .then(response => {
                    return request(server)
                        .post('/api/auth/login')
                        .send({ username: 'new user', password: 'password' })
                        .then(response => {
                            expect(response.status).toBe(200)
                        })
                })
        })
        it('should return a token', function() {
            return request(server)
                .post('/api/auth/login')
                .send({ username: 'new user', password: 'password' })
                .then(response => {
                    expect(response.body.token)
                })
        })
    })

    describe('/api/jokes', function() {
        it('should return status 200', function() {
            return request(server)
                .post('/api/auth/register')
                .send({ username: 'user1', password: 'password'})
                .then(response => {
                    return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'user1', password: 'password'})
                    .then(response => {
                        const token = response.body.token;
                        return request(server)
                            .get('/api/jokes')
                            .set('authorization', token)
                            .then(response => {
                                expect(response.status).toBe(200);
                            })
                    })
                })
        })

        it('should return status jokes', function() {
            return request(server)
                .post('/api/auth/register')
                .send({ username: 'user1', password: 'password'})
                .then(response => {
                    return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'user1', password: 'password'})
                    .then(response => {
                        const token = response.body.token;
                        return request(server)
                            .get('/api/jokes')
                            .set('authorization', token)
                            .then(response => {
                                expect(response.body.jokes)
                            })
                    })
                })
        })
    })
})