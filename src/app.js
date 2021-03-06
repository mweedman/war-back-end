const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error');

const gameRouter = require('./game/game-router');
const loginRouter = require('./login/login-router');
const statsRouter = require('./statistics/routes.statistics');
const creationRouter = require('./create/create-account-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


app.use('/api/game', gameRouter);
app.use('/api/login', loginRouter);
app.use('/api/stats', statsRouter);
app.use('/api/create', creationRouter);

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(errorHandler);

module.exports = app;