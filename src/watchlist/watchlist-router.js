const express = require('express')

const bodyParser = express.json();
const request = require('request');
const WatchlistService = require('./watchlist-service');
const watchlistRouter = express.Router()
const {requireAuth} = require('../middleware/jwt-auth')

/*  HTTP Methods to retrieve financial data from database */

//GET ALL STOCKS from User in DB (path: /watchlist/stocks/)
watchlistRouter.get('/stocks/', requireAuth, (req,res, next)=> {
    const knexInstance = req.app.get('db')

    WatchlistService.getAllStocks(knexInstance, req.user.id)
    .then(data =>{
      res.status(200)
      res.json(data)
    })
    .catch(next)
  })
  
  
//ADD NEW STOCK to DB for User (path: /watchlist/stocks/:symbol)
watchlistRouter.post('/stocks/:symbol', bodyParser, requireAuth, (req,res,next)=>{
  
  const {symbol} = req.params

      request(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c05827n48v6ta8gblt40`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err); }
        console.log(body);
        const {symbol} = req.params;
        const data = {
          price: body.c , 
          ticker: symbol,
          users_id: req.user.id
        }
        const knexInstance = req.app.get('db')
        WatchlistService.addStock(knexInstance, data)
        .then((data)=>{
          res.status(201)
          res.json(data)
        })
        .catch(next);
      });
      
})
  
  
//DELETE STOCK from DB for User (path: /watchlist/stocks/:id)
watchlistRouter.delete( '/stocks/:id', requireAuth, (req,res,next)=>{
  //id is unique id to that stock
  const {id} = req.params
  const knexInstance = req.app.get('db')
  WatchlistService.deleteStock(knexInstance, id)
  .then((data)=>{
    res.status(204).end()
  })
  .catch(next)
})

  module.exports = watchlistRouter;