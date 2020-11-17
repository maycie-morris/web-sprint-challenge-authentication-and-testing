const router = require('express').Router();
const Users = require('./auth-model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../api/config');

router.post('/register', (req, res) => {
  let userData = req.body;
  const hash = bcrypt.hashSync(userData.password, 12);
  userData.password = hash;

  Users.insert(userData)
    .then(user => {
      const token = genToken(user);
      res.status(200).json({
        message: `You have been registered.`,
        user,
        token: token
      });
    })
    .catch(err => {
      res.status(500).json({
         Error: err.message
        });
    });
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        res
          .status(200)
          .json({ message: `Welcome!`, user, token: token });
      } else {
        res.status(401).json({
         message: 'Invalid username/password' 
        });
      }
    })
    .catch(err => {
      res.status(500).json({ 
        Error: err.message
      });
    });
});

router.get('/', (req, res) => {
  Users.find().then(user => {
    res.status(200).json(user);
  });
});

function genToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '1h'
  };
  const token = jwt.sign(payload, secret.jwtSecret, options);
  return token;
}

module.exports = router;
