const express = require('express');
const cardMethods = require('./card-services');

const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const gameRouter = express.Router();

gameRouter.use(requireAuth);

gameRouter
  .route('/')
  .get((req, res) => {
    console.log(req.user);
    let cards = cardMethods.splitHands();
    res.json({cards});
  });

gameRouter
  .route('/play')
  .post(jsonBodyParser, (req, res) => {
    let nextMove = cardMethods.evaluatePlay(req.body);
    if(!nextMove){
      res.status(500)
        .send('Something went wrong');
    }
    res.status(200).json(nextMove);
  });

module.exports = gameRouter;
