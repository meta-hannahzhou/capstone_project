const express = require('express')
const router = express.Router()
var request = require('request');

// const {key} = require('authentication')

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.serverURL = "https://parseapi.back4app.com/"

router.get("/most-liked", async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.descending("likes")
        query.limit(1)
        const result = await query.find()
        
        var options = {
            url: `https://api.spotify.com/v1/tracks/${result[0].get("selectedSongId")}`,
            headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
            json: true
          };
      
        request.get(options, function(error, response, body) {
            res.status(200).json({body})
        });
    } catch (err) {
        next(err)
    }
})


router.get("/highest-rated", async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.descending("avgRating")
        query.limit(1)
        const result = await query.find()
        
        var options = {
            url: `https://api.spotify.com/v1/tracks/${result[0].get("selectedSongId")}`,
            headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
            json: true
          };
      
        request.get(options, function(error, response, body) {
            res.status(200).json({body})
        });
    } catch (err) {
        next(err)
    }
})

module.exports = router;