const express = require('express')
const router = express.Router()
var request = require('request');

const Parse = require('parse/node');
Parse.initialize("z81Jsr6Tc1lcHyxZK7a5psWRFOBuOs2e0nxXudMj", "JTrwOsEpJabYLzZVqKuG07FD5Lxwm2SzhM5EUVt5")
Parse.serverURL = "https://parseapi.back4app.com/"


// GET: top 20 tracks user has listened to across all time having Spotify using Spotify API
router.get('/:time', async (req, res, next) => {
    try {
        const time = req.params.time;
        var options = {
        url: `https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=${time}`,
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