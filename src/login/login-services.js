const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const loginService = {
  getUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first();
  },
  comparePasswords(password, hash){
    return bcrypt.compare(password, hash);
  },
  createJWT(subject, payload){
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  }
};

module.exports = loginService;