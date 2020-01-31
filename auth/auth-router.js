const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Users = require('./authModel');

const { jwtSecret } = require('../config/secrets');

router.post('/register', (req, res) => {
  // implement registration
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    }) 
    .catch(error => {
      res.status(500).json(error)
    }) 
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);

        res.status(200).json({
          token,
          message: `welcome ${user.username}`
        })
      } else {
        res.status(401).json({ error: "invalid credentials" })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

function signToken(user) {
  const payload = {
    id: user.id,
  };

  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
