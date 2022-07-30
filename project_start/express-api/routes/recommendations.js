const express = require("express");
const router = express.Router();
var request = require("request");
const { BadRequestError } = require("../utils/errors.js");

const Parse = require("parse/node");

Parse.initialize(
  "8mJaCOPGxTw5RVUHZ8Dfqx8oaZ5H0N4gTtfeIkrE",
  "phw3PutUNIb815ECj5D5acvbiNj90CfyKYi5i3om"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// GET: most liked cumulative song
router.get("/most-liked", async (req, res, next) => {
  const Songs = Parse.Object.extend("Songs");
  const query = new Parse.Query(Songs);
  const result = await query.find();
  let max = -1;
  let maxId = "";
  result.map((currSong) => {
    if (currSong.get("likes").length > max) {
      max = currSong.get("likes").length;
      maxId = currSong.get("songId");
    }
  });
  var options = {
    url: `https://api.spotify.com/v1/tracks/${maxId}`,
    headers: { Authorization: "Bearer " + req.app.get("access_token") },
    json: true,
  };

  request.get(options, function (error, response, body) {
    if (typeof body.error === "undefined") {
      res.status(200).json(body);
    } else {
      // res.status(body.error.status).json(body.error.message)
      res.status(200).json(body.error.message);
    }
  });
});

// GET: most commented on song
router.get("/most-commented", async (req, res, next) => {
  try {
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    const result = await query.find();
    let max = -1;
    let maxId = "";
    result.map((currSong) => {
      if (currSong.get("comments").length > max) {
        max = currSong.get("comments").length;
        maxId = currSong.get("songId");
      }
    });
    var options = {
      url: `https://api.spotify.com/v1/tracks/${maxId}`,
      headers: { Authorization: "Bearer " + req.app.get("access_token") },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(200).json({ body });
    });
  } catch (err) {
    next(err);
  }
});

router.get(`/top-genre`, async (req, res, next) => {
  const Recommendation = Parse.Object.extend("Recommendation");
  const query = new Parse.Query(Recommendation);
  query.equalTo("userId", req.app.get("userId"));
  const currRec = await query.first();
  const allGenres = await currRec.get("topGenres");

  let max = 0;
  let topGenre = "";
  for (var key in allGenres) {
    if (allGenres[key] > max) {
      max = allGenres[key];
      topGenre = key;
    }
  }
  res.status(200).json(topGenre);
});

// GET: most relevant song based on genre and likes
// weighted average of 0.25 * most commonly liked genre + 0.5 * most commonly posted about genre + 0.25 * most commonly posted about liked genre
router.get("/most-genre/:topGenre", async (req, res, next) => {
  try {
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.equalTo("genres", req.params.topGenre);
    query.descending("score");
    query.limit(1);
    const result = await query.first();

    var options = {
      url: `https://api.spotify.com/v1/tracks/${result.get("songId")}`,
      headers: { Authorization: "Bearer " + req.app.get("access_token") },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(200).json({ body });
    });
  } catch (err) {
    next(err);
  }
});

router.get("/most-relevant", async (req, res, next) => {
  try {
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.descending("score");
    query.limit(1);
    const result = await query.first();

    var options = {
      url: `https://api.spotify.com/v1/tracks/${result.get("songId")}`,
      headers: { Authorization: "Bearer " + req.app.get("access_token") },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(200).json({ body });
    });
  } catch (err) {
    next(err);
  }
});

// GET: highest rated song on average
router.get("/highest-rated", async (req, res, next) => {
  try {
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);
    query.descending("avgRating");
    query.limit(1);
    const result = await query.find();

    var options = {
      url: `https://api.spotify.com/v1/tracks/${result[0].get("songId")}`,
      headers: { Authorization: "Bearer " + req.app.get("access_token") },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(200).json({ body });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
