const express = require('express')
const router = express.Router()
var request = require('request');
const { BadRequestError } = require("../utils/errors.js")

const Parse = require('parse/node');
Parse.initialize("z81Jsr6Tc1lcHyxZK7a5psWRFOBuOs2e0nxXudMj", "JTrwOsEpJabYLzZVqKuG07FD5Lxwm2SzhM5EUVt5")
Parse.serverURL = "https://parseapi.back4app.com/"

// GET: most liked cumulative song
router.get("/most-liked", async (req, res, next) => {
    
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs)
    const result = await query.find()
    let max = -1;
    let maxId = "";
    result.map((currSong) => {
        if (currSong.get("likes").length > max) {
            max = currSong.get("likes").length;
            maxId = currSong.get("songId");
        }
    })
    var options = {
        url: `https://api.spotify.com/v1/tracks/${maxId}`,
        headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
        json: true
    };

    request.get(options, function(error, response, body) {

        if (typeof body.error === 'undefined') {
            res.status(200).json(body)
        } else {
            // res.status(body.error.status).json(body.error.message)
            res.status(200).json(body.error.message)
        }
        
    });
    
})


// GET: most commented on song
router.get("/most-commented", async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        const result = await query.find()
        let max = -1;
        let maxId = "";
        result.map((currSong) => {
            if (currSong.get("comments").length > max) {
                max = currSong.get("comments").length;
                maxId = currSong.get("songId");
            }
        })
        var options = {
            url: `https://api.spotify.com/v1/tracks/${maxId}`,
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

// GET: most relevant song based on genre and likes
// weighted average of 0.25 * most commonly liked genre + 0.5 * most commonly posted about genre + 0.25 * most commonly posted about liked genre 
router.get("/most-relevant/:topGenre", async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.equalTo("genres", req.params.topGenre)
        const matches = await query.find();
        let max = -1;
        let bestId = "";
        for (let i = 0; i < matches.length; i++) {
            const currLikes = await matches[i].get("likes").length;
            if (currLikes > max) {
                max = currLikes
                bestId = await matches[i].get("songId")
            }
        }

        var options = {
            url: `https://api.spotify.com/v1/tracks/${bestId}`,
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

// GET: highest rated song on average
router.get("/highest-rated", async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.descending("avgRating")
        query.limit(1)
        const result = await query.find()
        
        var options = {
            url: `https://api.spotify.com/v1/tracks/${result[0].get("songId")}`,
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