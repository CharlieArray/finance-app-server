require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const watchlistRouter = require('./watchlist/watchlist-router');
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/watchlist', watchlistRouter)


/* To Do List:
- add router file/refactor
- auth for front end
-crate bearer/auth token?

*/

/*
PsuedoCode Process to add new stock to watchlistdatabase table
-User inputs stock name in form
-Fetch request/websocket io function to 3rd party API
-response data from api => add new stock to database


PsuedoCode Process to remove stock from watchlist database table
 -User clicks on delete button on watchlist
 -delete button needs to have id value
 -id value gets sent to WatchlistService
*/

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {~
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
