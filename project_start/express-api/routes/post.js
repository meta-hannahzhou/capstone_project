const express = require('express')
const router = express.Router()
var request = require('request');

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
// Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.initialize("jf8fBQCKtSE8fxxzMlARZZYxGgbMwLA2l9tAfwSU", "z25hAbCBiOVPkYzHIJt8PXLjZxKTDhsuvhMaVtuM")
Parse.serverURL = "https://parseapi.back4app.com/"

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
        const { selectedSongId, selectedSongUrl, selectedSongName, review, mood, rating } = req.body
        const Posts = Parse.Object.extend("Posts");
        const post = new Posts();
    
        post.set({
          "selectedSongId": selectedSongId,
          "review": review, 
          "mood": mood, 
          "rating": rating,
          "userId": req.app.get('userId'),
          "likes": [],
          "comments": []
        })
    
        post.save()

        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.equalTo("selectedSongId", selectedSongId)
        const foundSong = await query.find()
        
        if (foundSong.length == 0) {
            const song = new Songs();
            song.set({
                "selectedSongId": selectedSongId,
                "selectedSongUrl": selectedSongUrl,
                "selectedSongName": selectedSongName,
                "likes": [],
                "comments": [],
                "avgRating": parseInt(rating),
                "quantity": 1
            })
            song.save()
        } else {
            const currSong = foundSong[0]
            currSong.set("avgRating", (currSong.get("avgRating") * currSong.get("quantity") + parseInt(rating))/(currSong.get("quantity") + 1))
            currSong.increment("quantity")
            currSong.save()
        }
        

        res.send({"post completed": "success"})
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


// GET: get info for specific post from post object id
router.get("/:postId", getCurrPost, async (req, res, next) => {
    try {
        const Songs = Parse.Object.extend("Songs");
        const query = new Parse.Query(Songs)
        query.equalTo("selectedSongId", res.post.get("selectedSongId"))
        const foundSong = await query.find()

        res.status(200).json(foundSong[0]);
        next();
    } catch (err) {
      next(err)
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
        const { selectedSongId, userObjectId, comment} = req.body
        const Comments = Parse.Object.extend("Comments");
        const currComment = new Comments();
        currComment.set({
            "comment": comment,
            "selectedSongId": selectedSongId,
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
    query.equalTo("selectedSongId", res.post.get("selectedSongId"))
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


// POST: add new like to Likes table
router.post('/:postId/new-like', getCurrPost, async (req, res, next) => {
    try {
        // Adding new comment to Comments database
        const { selectedSongId, userObjectId } = req.body
        const Likes = Parse.Object.extend("Likes");
        const currLike = new Likes();
        currLike.set({
            "selectedSongId": selectedSongId,
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


// PUT: append or remove new like id to likes array in Posts database
router.put('/:postId/post-like', getCurrPost, async (req, res, next) => {
    let currLikes = await res.post.get("likes");

    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("selectedSongId", res.post.get("selectedSongId"));
    const foundSong = await query.find();
    let currSongLikes = await foundSong[0].get("likes");

    if (req.body.isLiked) {
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
