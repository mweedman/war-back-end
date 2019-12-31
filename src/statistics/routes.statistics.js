const express = require('express');

const jsonBodyParser = express.json();

const statisticsRouter = express.Router();

statisticsRouter
  .route('/')
  .get((req,res) => {
    //Will simply display statistics
  });

statisticsRouter
  .route('/update')
  .post();
module.exports = statisticsRouter;