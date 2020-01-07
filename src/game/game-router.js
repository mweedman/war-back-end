const express = require('express');
const cardMethods = require('./card-services');

const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const gameRouter = express.Router();

gameRouter.use(requireAuth);

gameRouter
  .route('/')
  .get((req, res) => {
    let cards = cardMethods.dealNewGame();
    res.json({cards});
  });

gameRouter
  .route('/deal')
  .get((req, res) => {
    console.log(req.user);
    let cards = cardMethods.dealNewGame();
    res.json({cards});
  });

gameRouter
  .route('/')
  .post((req, res) => {
    let cards = cardMethods.playCard();
    if(!cards){
      res.status(500)
        .send('Something went wrong');
    }
    res.status(200).json({cards});
  });

module.exports = gameRouter;
