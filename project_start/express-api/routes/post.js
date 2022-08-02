const express = require("express");
const router = express.Router();
var request = require("request");
var brain = require("brain.js");

const { default: axios } = require("axios");

const Parse = require("parse/node");
const ParseKeys = require("../parseKeys.js");

Parse.initialize(ParseKeys[0], ParseKeys[1]);

Parse.serverURL = "https://parseapi.back4app.com/";

const baseTime = new Date("2022-07-19T20:36:06.609Z");
const k = 5;

// GET: search for specific tracks through Spotify API
router.get("/search/:query", async (req, res, next) => {
  try {
    const query = req.params.query;

    var options = {
      url: `https://api.spotify.com/v1/search?q=${query}&type=track&limit=8`,
      headers: { Authorization: "Bearer " + req.app.get("access_token") },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(201).json({ body });
    });
  } catch (err) {
    next(err);
  }
});

router.get("/audio-features&songId=:songId", async (req, res, next) => {
  try {
    const features = await axios.get(
      `https://api.spotify.com/v1/audio-features/${req.params.songId}`,
      {
        headers: { Authorization: "Bearer " + req.app.get("access_token") },
        json: true,
      }
    );
    res.status(200).json(features.data);
  } catch (err) {
    next(err);
  }
});

router.put("/ml-rec", async (req, res, next) => {
  try {
    const audioFeatures = req.body.audioFeatures;

    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", req.app.get("userId"));
    const response = await recQuery.first();

    const modelJSON = await response.get("mlModel");
    const loadedNet = new brain.NeuralNetwork();
    loadedNet.fromJSON(modelJSON);
    const predictedRating = loadedNet.run([
      audioFeatures.danceability,
      audioFeatures.energy,
      audioFeatures.speechiness,
      audioFeatures.acousticness,
      audioFeatures.instrumentalness,
      audioFeatures.liveness,
      audioFeatures.valence,
    ]);

    const topMLSong = await response.get("topMLSong");

    if (predictedRating > topMLSong["rating"]) {
      const updateTopSong = {
        rating: predictedRating["0"],
        songId: req.body.songId,
      };
      response.set("topMLSong", updateTopSong);
    }

    await response.save();

    res.status(200).send("completed!");
  } catch (err) {
    next(err);
  }
});

// POST: allows user to make a new post from form
// Updates POST table and SONGS table
router.post("/new-post", async (req, res, next) => {
  try {
    const {
      songId,
      selectedSongUrl,
      selectedSongName,
      selectedArtistId,
      review,
      mood,
      rating,
      audioFeatures,
    } = req.body;
    const Posts = Parse.Object.extend("Posts");
    const post = new Posts();

    await post.set({
      songId: songId,
      review: review,
      mood: mood,
      rating: rating,
      userId: req.app.get("userId"),
      likes: [],
      comments: [],
      score: 0,
    });

    post.save();

    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("songId", songId);
    const foundSong = await query.find();

    if (foundSong.length == 0) {
      const song = new Songs();
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${selectedArtistId}`,
        {
          headers: { Authorization: "Bearer " + req.app.get("access_token") },
          json: true,
        }
      );

      song.set({
        songId: songId,
        selectedSongUrl: selectedSongUrl,
        selectedSongName: selectedSongName,
        selectedArtistId: selectedArtistId,
        likes: [],
        comments: [],
        avgRating: parseInt(rating),
        quantity: 1,
        genres: response.data.genres,
        score: 0,
        dance: audioFeatures.danceability,
        energy: audioFeatures.energy,
        speech: audioFeatures.speechiness,
        acoust: audioFeatures.acousticness,
        instru: audioFeatures.instrumentalness,
        live: audioFeatures.liveness,
        vale: audioFeatures.valence,
      });

      await song.save();

      res.status(200).json(song);
    } else {
      const currSong = foundSong[0];
      currSong.set(
        "avgRating",
        (currSong.get("avgRating") * currSong.get("quantity") +
          parseInt(rating)) /
          (currSong.get("quantity") + 1)
      );
      currSong.increment("quantity");
      currSong.set(
        "score",
        currSong.get("avgRating") * Math.log(currSong.get("quantity")) +
          currSong.get("likes").length / 50 +
          currSong.get("comments").length / 50
      );
      await currSong.save();
      res.status(200).json(currSong);
    }
  } catch (err) {
    next(err);
  }
});

//https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
router.post("/new-post-rec", async (req, res, next) => {
  try {
    const { audioFeatures } = req.body;
    // Add to Rec table
    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", req.app.get("userId"));
    const response = await recQuery.first();

    // dance acoustic liveness
    let userDance = await response.get("dance");
    let userAcoust = await response.get("acoust");
    let userLive = await response.get("live");

    response.set("dance", userDance + audioFeatures.danceability);
    response.set("acoust", userAcoust + audioFeatures.acousticness);
    response.set("live", userLive + audioFeatures.liveness);

    var categories = [
      ["dance", userDance + audioFeatures.danceability],
      ["acoust", userAcoust + audioFeatures.acousticness],
      ["live", userLive + audioFeatures.liveness],
    ];

    categories.sort(function (first, second) {
      return second[1] - first[1];
    });

    response.set("max1", categories[0][0]);
    response.set("max2", categories[1][0]);
    response.save();

    res.status(200).json([categories[0], categories[1]]);
  } catch (err) {
    next(err);
  }
});

// Middleware for getting the current post to limit redundancy
const getCurrPost = async (req, res, next) => {
  const postId = req.params.postId;
  const Posts = Parse.Object.extend("Posts");
  const postQuery = new Parse.Query(Posts);
  const post = await postQuery.get(postId);
  res.post = post;
  next();
};

const getMax = async (category, Songs, max1, max2, userVals) => {
  const query = new Parse.Query(Songs);
  query.descending(category);
  query.limit(k);
  query.select("songId", "selectedSongName", "dance", "acoust", "live");
  let results = await query.find();
  let finalOutput = [];
  for (let i = 0; i < results.length; i++) {
    let output = {};
    output["songId"] = await results[i].get("songId");
    output["selectedSongName"] = await results[i].get("selectedSongName");
    output["dance"] = await results[i].get("dance");
    output["acoust"] = await results[i].get("acoust");
    output["live"] = await results[i].get("live");
    output["score"] =
      output[max1] * userVals[max1] + output[max2] * userVals[max2];
    finalOutput.push(output);
  }
  return finalOutput;
};

//GET: initializes cache that stores info about top k songs
router.get("/top-songs", async (req, res, next) => {
  try {
    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", await req.app.get("userId"));
    const response = await recQuery.first();

    // dance acoustic liveness
    let userDance = await response.get("dance");
    let userAcoust = await response.get("acoust");
    let userLive = await response.get("live");

    let userVals = { dance: userDance, acoust: userAcoust, live: userLive };
    let max1 = await response.get("max1");
    let max1Val = await response.get(max1);

    let max2 = await response.get("max2");
    let max2Val = await response.get(max2);

    const Songs = Parse.Object.extend("Songs");

    let topDance = await getMax("dance", Songs, max1, max2, userVals);
    let topAcoust = await getMax("acoust", Songs, max1, max2, userVals);
    let topLive = await getMax("live", Songs, max1, max2, userVals);

    res.status(200).json([
      topDance,
      topAcoust,
      topLive,
      [
        [max1, max1Val],
        [max2, max2Val],
      ],
    ]);
  } catch (err) {
    next(err);
  }
});

//GET: get all posts that have been made
router.get("/all", async (req, res, next) => {
  try {
    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    const all = await postQuery.find();
    res.status(200).json(all);
  } catch (err) {
    next(err);
  }
});

// GET: get info for specific song from post from post object id
router.get("/:postId", getCurrPost, async (req, res, next) => {
  try {
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("songId", res.post.get("songId"));
    const foundSong = await query.find();

    res.status(200).json(foundSong[0]);
    next();
  } catch (err) {
    next(err);
  }
});

// PUT: update score for certain post
// Score calculated based on Hacker NewsRank Algorithm
router.put("/:postId/score", getCurrPost, async (req, res, next) => {
  try {
    const likes = await res.post.get("likes");
    let currentTime = new Date(res.post.updatedAt);
    let difference = (currentTime - baseTime) / 1000 / 60;
    const score = (likes.length ^ 0.8) / ((difference + 120) ^ 1.8);
    // number of likes in a certain period of time
    await res.post.set("score", score * 1000);
    await res.post.save();
    res.send("success");
  } catch (err) {
    next(err);
  }
});

/**
 * COMMENTS
 */

// GET: get all comments on a certain post
router.get("/:postId/comments", async (req, res, next) => {
  try {
    const Comments = Parse.Object.extend("Comments");
    const commentQuery = new Parse.Query(Comments);
    commentQuery.equalTo("postId", req.params.postId);
    const results = await commentQuery.find();
    res.status(200).json(results);
    next();
  } catch (err) {
    next(err);
  }
});

// POST: add new comment to Comments database
router.post("/:postId/new-comment", async (req, res, next) => {
  try {
    // Adding new comment to Comments database
    const { songId, userObjectId, comment } = req.body;
    const Comments = Parse.Object.extend("Comments");
    const currComment = new Comments();
    currComment.set({
      comment: comment,
      songId: songId,
      postId: req.params.postId,
      userObjectId: userObjectId,
      userId: req.app.get("userId"),
    });

    // Updating Posts database and appending comment id to commments field
    const savedComment = await currComment.save();

    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
});

// PUT: append new comment object id to comments array in Posts database
router.put(
  "/:postId/update-post-comment",
  getCurrPost,
  async (req, res, next) => {
    let currComments = await res.post.get("comments");
    currComments.push(req.body.commentId);
    res.post.set("comments", currComments);
    res.post.save();

    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("songId", res.post.get("songId"));
    const foundSong = await query.find();
    let currSongComments = await foundSong[0].get("comments");
    let currSongScore = await foundSong[0].get("score");
    currSongComments.push(req.body.commentId);
    foundSong[0].set("comments", currSongComments);
    foundSong[0].set("score", currSongScore + 1 / 50);
    foundSong[0].save();

    res.status(200).json(currComments);
  }
);

// DELETE: delete comment from Comments table and remove id from Songs and Posts comments array
router.delete(
  "/:postId/delete-comment&commentId=:commentId&songId=:songId",
  getCurrPost,
  async (req, res, next) => {
    try {
      let currComments = await res.post.get("comments");

      const commentId = req.params.commentId;
      const Comments = Parse.Object.extend("Comments");
      const commentQuery = new Parse.Query(Comments);
      const currComment = await commentQuery.get(commentId);

      const Songs = Parse.Object.extend("Songs");
      const query = new Parse.Query(Songs);
      query.equalTo("songId", req.params.songId);
      const foundSong = await query.first();
      let currSongComments = await foundSong.get("comments");
      let currSongScore = await foundSong.get("score");
      currSongScore -= 1 / 50;
      await currComment.destroy();
      const index = currComments.indexOf(req.body.commentId);
      currComments.splice(index, 1);

      const songIndex = currSongComments.indexOf(req.body.commentId);
      currSongComments.splice(songIndex, 1);

      res.post.set("comments", currComments);
      await res.post.save();

      foundSong.set("comments", currSongComments);
      foundSong.set("score", currSongScore);
      await foundSong.save();

      res.send("success!");
    } catch (err) {
      next(err);
    }
  }
);

/**
 * LIKES
 */

// GET: get all likes on a certain post
router.get("/:postId/likes", async (req, res, next) => {
  try {
    const Likes = Parse.Object.extend("Likes");
    const likeQuery = new Parse.Query(Likes);

    likeQuery.equalTo("postId", req.params.postId);
    const results = await likeQuery.find();
    res.status(200).json(results);
    next();
  } catch (err) {
    next(err);
  }
});

// GET: check if user has liked specific post
router.get(
  "/:postId/has-liked&userObjectId=:userObjectId",
  async (req, res, next) => {
    try {
      const Likes = Parse.Object.extend("Likes");
      const likeQuery = new Parse.Query(Likes);

      likeQuery.equalTo("userObjectId", req.params.userObjectId);
      likeQuery.equalTo("postId", req.params.postId);
      const results = await likeQuery.find();

      if (results.length == 0) {
        res.status(200).json("");
      } else {
        res.status(200).json(results[0].id);
      }
      next();
    } catch (err) {
      next(err);
    }
  }
);

// POST: add new like to Likes table
router.post("/:postId/new-like", async (req, res, next) => {
  try {
    // Adding new comment to Comments database
    const { songId, userObjectId } = req.body;
    const Likes = Parse.Object.extend("Likes");
    const currLike = new Likes();
    currLike.set({
      songId: songId,
      userObjectId: userObjectId,
      postId: req.params.postId,
    });

    const savedLike = await currLike.save();

    res.status(200).json(savedLike);
  } catch (err) {
    next(err);
  }
});

// PUT: append or remove new like id to likes array in Posts and Songs database
router.put("/:postId/post-like", getCurrPost, async (req, res, next) => {
  let currLikes = await res.post.get("likes");

  const Songs = Parse.Object.extend("Songs");
  const query = new Parse.Query(Songs);
  query.equalTo("songId", res.post.get("songId"));
  const foundSong = await query.find();
  let currSongLikes = await foundSong[0].get("likes");
  let currSongScore = await foundSong[0].get("score");

  if (!req.body.isLiked) {
    currLikes.push(req.body.likeId);
    currSongLikes.push(req.body.likeId);
    currSongScore += 1 / 50;
  } else {
    const index = currLikes.indexOf(req.body.likeId);
    currLikes.splice(index, 1);

    const songIndex = currSongLikes.indexOf(req.body.likeId);
    currSongLikes.splice(songIndex, 1);
    currSongScore -= 1 / 50;
  }
  res.post.set("likes", currLikes);
  res.post.save();

  foundSong[0].set("likes", currSongLikes);
  foundSong[0].set("score", currSongScore);
  foundSong[0].save();

  res.status(200).json(currLikes);
});

// DELETE: remove like from current post in Likes table
router.delete(
  "/:postId/delete-like&likedObjectId=:likedObjectId",
  getCurrPost,
  async (req, res, next) => {
    try {
      const likedObjectId = req.params.likedObjectId;
      const Likes = Parse.Object.extend("Likes");
      const likeQuery = new Parse.Query(Likes);
      const currLike = await likeQuery.get(likedObjectId);

      await currLike.destroy();
      res.status(200).json(currLike);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
