const express = require('express');

const { requireAuth } = require('../middleware/jwt-auth');
const statisticsRouter = express.Router();

statisticsRouter.use(requireAuth);

statisticsRouter
  .route('/')
  .get((req,res) => {
    //Will simply display statistics
  });

module.exports = statisticsRouter;