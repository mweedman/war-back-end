const express = require('express');
const path = require('path');
const CreationServices = require('./create-account-services');

const creationRouter = express.Router();
const jsonBodyParser = express.json();

creationRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, email_address } = req.body;
    for (const field of ['password', 'user_name', 'email_address'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body.`
        });

    const passwordError = CreationServices.validatePassword(password);
    
    if (passwordError)
      return res.status(400).json({ error: passwordError });
    
    CreationServices.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({
            error: 'Username already exists.'
          });

        return CreationServices.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              user_password: hashedPassword,
              email_address,
              date_created: 'now()',
              date_modified: 'now()'
            };

            return CreationServices.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user_name}`))
                  .json(CreationServices.serializeUser(user));
              });
          });
      })
      .catch(next);
  });


module.exports = creationRouter;