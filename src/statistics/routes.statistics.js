const express = require('express');

const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const statisticsRouter = express.Router();

statisticsRouter
  .route('/')
  .get((req,res) => {
    //Will simply display statistics
  });

statisticsRouter
  //Will automatically update database with user statistics after each game played?
  .route('/update')
  .post();

module.exports = statisticsRouter;