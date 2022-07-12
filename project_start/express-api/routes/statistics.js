const express = require('express')
const router = express.Router()
var request = require('request');

// const {key} = require('authentication')

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
// Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.initialize("jf8fBQCKtSE8fxxzMlARZZYxGgbMwLA2l9tAfwSU", "z25hAbCBiOVPkYzHIJt8PXLjZxKTDhsuvhMaVtuM")
Parse.serverURL = "https://parseapi.back4app.com/"


// GET: top 20 tracks user has listened to across all time having Spotify using Spotify API
router.get('/', async (req, res, next) => {
    try {
        var options = {
        url: `https://api.spotify.com/v1/me/top/tracks?offset=0&limit=20&time_range=long_term`,
        headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
        json: true
        };

        request.get(options, function(error, response, body) {
        res.status(200).json({body})
        });

    } catch(err) {
        next(err)
    }
})

module.exports = router;