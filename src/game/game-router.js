const express = require('express');
const cardMethods = require('./card-services');

const {requireAuth} = require('../middleware/jwt-auth');
const gameRouter = express.Router();

gameRouter.use(requireAuth);

gameRouter
  .route('/')
  .get((req, res) => {
    let db = req.app.get('db');
    let user_id = req.payload.user_id;
    let cards = cardMethods.dealNewGame(db, user_id);
    res.json({cards});
  });

gameRouter
  .route('/')
  .post((req, res) => {
    let db = req.app.get('db');
    let user_id = req.payload.user_id;
    let cards = cardMethods.playCard(db, user_id);
    if(!cards){
      res.status(500)
        .send('Something went wrong');
    }
    res.status(200).json({cards});
  });

module.exports = gameRouter;
