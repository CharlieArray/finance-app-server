const WatchlistService = {

    //GET ALL STOCKS
    getAllStocks(knex, users_id){
        return(knex)
        .select('*')
        .from('watchlist')
        .where('users_id', users_id)
    },


    //ADD NEW STOCK TO WATCHLIST
    addStock(knex, data){
        return(knex)
        .insert(data)
        .into('watchlist')
        .returning('*')
    },


    //DELETE STOCK FROM WATCHLIST
    deleteStock(knex, id){
        return knex('watchlist')
        .where('id', id)
        .delete();
    },
    
}

module.exports = WatchlistService;