const express = require('express');
const router = express.Router();
var request = require('request');

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
// Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.initialize("jf8fBQCKtSE8fxxzMlARZZYxGgbMwLA2l9tAfwSU", "z25hAbCBiOVPkYzHIJt8PXLjZxKTDhsuvhMaVtuM");
Parse.serverURL = "https://parseapi.back4app.com/";


// GET: get basic profile information from Spotify API
router.get('/', async (req, res, next) => {
    try {
      var options = {
        url: `https://api.spotify.com/v1/me`,
        headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
        json: true
      };
      request.get(options, function(error, response, body) {
        res.status(200).json({body})
      });
    } catch(err) {
      next(err);
    }
  }) 

// GET: get info about all posts a user has liked
router.get('/liked/:userObjectId', async (req, res, next) => {
    try {
        
        const userObjectId = req.params.userObjectId;
        
        const Likes = Parse.Object.extend("Likes");
        const likeQuery = new Parse.Query(Likes);
        likeQuery.equalTo("userObjectId", userObjectId);
        
        const result = await likeQuery.find();
        
        res.status(200).json({result})

    } catch(err) {
        next(err)
    }
})
  
// GET: get all the posts user has made
router.get('/posted', async (req, res, next) => {
    try {
        const Posts = Parse.Object.extend("Posts");
        const postQuery = new Parse.Query(Posts);
        postQuery.descending("createdAt")
        postQuery.equalTo("userId", req.app.get('userId'));
        const posted = await postQuery.find();
        
        res.status(200).json(posted)

    } catch(err) {
        next(err)
    }
})

module.exports = router;
