const express = require('express');
const cardMethods = require('./card-services');


// const authentication = require('../middleware/validation');
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const gameRouter = express.Router();

gameRouter
  .route('/')
  .get(requireAuth, (req, res) => {
    let cards = cardMethods.splitHands();
    res.json({cards});
  });

gameRouter
  .route('/play')
  .post(requireAuth, jsonBodyParser, (req, res) => {
    let nextMove = cardMethods.evaluatePlay(req.body);
    if(!nextMove){
      res.status(500)
        .send('Something went wrong');
    }
    res.status(200).json(nextMove);
  });

module.exports = gameRouter;
