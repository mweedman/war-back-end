const express = require('express');

const { requireAuth } = require('../middleware/jwt-auth');
const statisticsRouter = express.Router();
const statsServices = require('./services.statistics');

statisticsRouter.use(requireAuth);

statisticsRouter
  .route('/')
  .get((req,res) => {
    let db = req.app.get('db');
    let user_id = req.payload.user_id;
    let stats = statsServices.getStats(db,user_id);
    if(!stats){
      res.status(500)
        .send('Something went wrong');
    }
    res.status(200).json({stats});
  });

module.exports = statisticsRouter;