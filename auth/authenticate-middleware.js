/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, (error, token) => {
      if (error) {
        res.status(401).json({ error: "invalid token" })
      } else {
        req.user = { username: token.username }

        next();
      }
    })
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }
};
