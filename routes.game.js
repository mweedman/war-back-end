const express = require('express');


const authentication = require('../middleware/validation');
const jsonBodyParser = express.json();

const gameRouter = express.Router();

gameRouter
  .route('/')
  .get((req, res) => {
    res.json({sucess: true});
  });

module.exports = gameRouter;
