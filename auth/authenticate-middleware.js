/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');
const secret = require('../api/config');

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (req.decodedJwt) {
    next();
  } else if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedJwt) => {
      if (err) {
        res.status(401).json({ 
          message: 'You are not authorized' 
        });
      } else {
        req.decodedJwt = decodedJwt;
        next();
      }
    });
  } else {
    res.status(401).json({ 
      message: 'You are not authorized' 
    });
  }
}

module.exports = auth;
