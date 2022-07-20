const express = require('express')
const router = express.Router()
var request = require('request');

const Parse = require('parse/node');
Parse.initialize("z81Jsr6Tc1lcHyxZK7a5psWRFOBuOs2e0nxXudMj", "JTrwOsEpJabYLzZVqKuG07FD5Lxwm2SzhM5EUVt5")
Parse.serverURL = "https://parseapi.back4app.com/"

const baseTime = new Date("2022-07-19T20:36:06.609Z");

// GET: search for specific tracks through Spotify API
router.get('/search/:query', async (req, res, next) => {
    try {
      const query = req.params.query
    
      var options = {
        url: `https://api.spotify.com/v1/search?q=${query}&type=track&limit=8`,
        headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
        json: true
      };
  
      request.get(options, function(error, response, body) {
        res.status(201).json({body})
      });
  
    } catch(err) {
      next(err)
    }
  })

// POST: allows user to make a new post from form
// Updates POST table and SONGS table
router.post("/new-post", async (req, res, next) => {
    try {
        const { songId, selectedSongUrl, selectedSongName, selectedArtistId, review, mood, rating } = req.body
        const Posts = Parse.Object.extend("Posts");
        const post = new Posts();
    
        post.set({
          "songId": songId,
          "review": review, 
          "mood": mood, 
          "rating": rating,
          "userId": req.app.get('userId'),
          "likes": [],
          "comments": [],
          score: 0
        })
    
        post.save()

        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.equalTo("songId", songId)
        const foundSong = await query.find()

        if (foundSong.length == 0) {
            var options = {
                url: `https://api.spotify.com/v1/artists/${selectedArtistId}`,
                headers: { 'Authorization': 'Bearer ' + req.app.get('access_token')},
                json: true
              };
        
        
            const song = new Songs();
            request.get(options, function(error, response, body) {
                song.set({
                    "songId": songId,
                    "selectedSongUrl": selectedSongUrl,
                    "selectedSongName": selectedSongName,
                    "selectedArtistId": selectedArtistId,
                    "likes": [],
                    "comments": [],
                    "avgRating": parseInt(rating),
                    "quantity": 1,
                    "genres": body.genres
                })
                song.save()
            res.status(200).json(song)
            });
            
        } else {
            const currSong = foundSong[0]
            currSong.set("avgRating", (currSong.get("avgRating") * currSong.get("quantity") + parseInt(rating))/(currSong.get("quantity") + 1))
            currSong.increment("quantity")
            currSong.save()
            res.send({"post completed": "success"})
        }
    
       
      } catch (err) {
        next(err)
      }
})


// Middleware for getting the current post to limit redundancy
const getCurrPost = async (req, res, next) => {
    const postId = req.params.postId;
    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    const post = await postQuery.get(postId);
    res.post = post;
    next()
}


// GET: get info for specific song from post from post object id
router.get("/:postId", getCurrPost, async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.equalTo("songId", res.post.get("songId"))
        const foundSong = await query.find()

        res.status(200).json(foundSong[0]);
        next();
    } catch (err) {
      next(err)
    }
})


// PUT: update score for certain post
// Score calculated based on Hacker NewsRank Algorithm
router.put("/:postId/score", getCurrPost, async (req, res, next) => {
    try {
        const likes = await res.post.get("likes")
        let currentTime = new Date();
        let difference = (((currentTime - baseTime)/1000)/60);
        const score = ((likes.length)^0.8)/((difference+120)^1.8)
        await res.post.set("score", score*1000);
        await res.post.save();
        res.send("success");
    } catch (err) {
        next(err);
    }
})

/**
 * COMMENTS
 */


// GET: get all comments on a certain post
router.get("/:postId/comments", getCurrPost, async (req, res, next) => {
    try {
        const Comments = Parse.Object.extend("Comments");
        const commentQuery = new Parse.Query(Comments)
        commentQuery.equalTo("postId", res.post)
        const results = await commentQuery.find()
        res.status(200).json(results)
        next()
    } catch (err) {
      next(err)
    }
})


// POST: add new comment to Comments database
router.post('/:postId/new-comment', getCurrPost, async (req, res, next) => {
    try {
    // Adding new comment to Comments database
        const { songId, userObjectId, comment} = req.body
        const Comments = Parse.Object.extend("Comments");
        const currComment = new Comments();
        currComment.set({
            "comment": comment,
            "songId": songId,
            "postId": res.post,
            "userObjectId": userObjectId,
            "userId": req.app.get('userId')
        })
        
        // Updating Posts database and appending comment id to commments field
        const savedComment = await currComment.save()
        
        res.status(200).json(savedComment)
        
    } catch (err) {
        next(err)
    }
})


// PUT: append new comment object id to comments array in Posts database
router.put('/:postId/update-post-comment', getCurrPost, async (req, res, next) => {
    let currComments = await res.post.get("comments")
    currComments.push(req.body.commentId)
    res.post.set("comments", currComments)
    res.post.save()

    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs)
    query.equalTo("songId", res.post.get("songId"))
    const foundSong = await query.find()
    let currSongComments = await foundSong[0].get("comments")
    currSongComments.push(req.body.commentId)
    foundSong[0].set("comments", currSongComments)
    foundSong[0].save()

    res.status(200).json(currComments)
})


// DELETE: delete comment from Comments table and remove id from Songs and Posts comments array
router.delete('/:postId/delete-comment&commentObjectId=:commentObjectId', getCurrPost, async (req, res, next) => {
    let currComments = await res.post.get("comments")
    currComments.push(req.body.commentId)
    res.post.set("comments", currComments)
    res.post.save()

    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs)
    query.equalTo("songId", res.post.get("songId"))
    const foundSong = await query.find()
    let currSongComments = await foundSong[0].get("comments")
    currSongComments.push(req.body.commentId)
    foundSong[0].set("comments", currSongComments)
    foundSong[0].save()

    res.status(200).json(currComments)
})



/**
 * LIKES
 */

// GET: get all likes on a certain post
router.get("/:postId/likes", getCurrPost, async (req, res, next) => {
    try {
        const Likes = Parse.Object.extend("Likes");
        const likeQuery = new Parse.Query(Likes)
        
        likeQuery.equalTo("postId", res.post)
        const results = await likeQuery.find()
        res.status(200).json(results)
        next()
    } catch (err) {
      next(err)
    }
})


// GET: check if user has liked specific post
router.get("/:postId/has-liked&userObjectId=:userObjectId", getCurrPost, async (req, res, next) => {
    try {
        const Likes = Parse.Object.extend("Likes");
        const likeQuery = new Parse.Query(Likes)
        
        likeQuery.equalTo("userObjectId", req.params.userObjectId)
        likeQuery.equalTo("postId", res.post)
        const results = await likeQuery.find()
        
        if (results.length == 0) {
            res.status(200).json("")
        } else {
            res.status(200).json(results[0].id)
        }
        next()
    } catch (err) {
      next(err)
    }
})


// POST: add new like to Likes table
router.post('/:postId/new-like', getCurrPost, async (req, res, next) => {
    try {
        // Adding new comment to Comments database
        const { songId, userObjectId } = req.body
        const Likes = Parse.Object.extend("Likes");
        const currLike = new Likes();
        currLike.set({
            "songId": songId,
            "userObjectId": userObjectId,
            "postId": res.post
        })
        
        const savedLike = await currLike.save()
        
        res.status(200).json(savedLike)
        
    } catch (err) {
        next(err)
    }
})


// DELETE: remove like from current post in Likes table
router.delete('/:postId/delete-like&likedObjectId=:likedObjectId', getCurrPost, async (req, res, next) => {
    try {
        const likedObjectId = req.params.likedObjectId;
        const Likes = Parse.Object.extend("Likes");
        const likeQuery = new Parse.Query(Likes);
        const currLike = await likeQuery.get(likedObjectId);

        await currLike.destroy();
        res.status(200).json(currLike);

    } catch (err) {
        next(err)
    }
})


// PUT: append or remove new like id to likes array in Posts and Songs database
router.put('/:postId/post-like', getCurrPost, async (req, res, next) => {
    let currLikes = await res.post.get("likes");
    
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("songId", res.post.get("songId"));
    const foundSong = await query.find();
    let currSongLikes = await foundSong[0].get("likes");

    if (!req.body.isLiked) {
        currLikes.push(req.body.likeId);
        currSongLikes.push(req.body.likeId);
    } else {
        const index = currLikes.indexOf(req.body.likeId);
        currLikes.splice(index, 1);

        const songIndex = currSongLikes.indexOf(req.body.likeId);
        currSongLikes.splice(songIndex, 1);
    }
    res.post.set("likes", currLikes)
    res.post.save()

    foundSong[0].set("likes", currSongLikes)
    foundSong[0].save()

    res.status(200).json(currLikes)
  })


module.exports = router;
