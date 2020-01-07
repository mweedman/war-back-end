/* eslint-disable no-useless-escape */
const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const CreationServices = {
  hasUserWithUserName(db, user_name) {
    return db('accounts')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('accounts')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password should be at least 8 characters long.';
    }
    if (password.length > 72) {
      return 'Password should be less than 72 characters long.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with spaces.';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number, and special character.';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      user_name: xss(user.user_name),
      user_role: 'user',
      email_address: xss(user.email_address)
    };
  }
};

module.exports = CreationServices;