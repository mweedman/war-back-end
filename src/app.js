const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error');

const gameRouter = require('./game/routes.game');
const loginRouter = require('./login/routes.login');
const statsRouter = require('./statistics/routes.statistics');

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

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(errorHandler);

module.exports = app;