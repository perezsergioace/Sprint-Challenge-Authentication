const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const Users = require('../auth/authModel');
const Authenticate = require('../auth/authenticate-middleware');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
    res.status(200).json({ api: "up", dbenv: process.env.DB_ENV})
});

server.get('/users', (req, res) => {
    Users.getAll()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({ error: "error retrieving users" })
        })
})

module.exports = server;
