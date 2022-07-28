const express = require("express");
const router = express.Router();
var request = require("request");

const Parse = require("parse/node");

Parse.initialize(
  "8mJaCOPGxTw5RVUHZ8Dfqx8oaZ5H0N4gTtfeIkrE",
  "phw3PutUNIb815ECj5D5acvbiNj90CfyKYi5i3om"
);
Parse.serverURL = "https://parseapi.back4app.com/";

router.get("/moods", async (req, res, next) => {
  try {
    const Posts = Parse.Object.extend("Posts");
    const userQuery = new Parse.Query(Posts);
    userQuery.equalTo("userId", req.app.get("userId"));
    const matches = await userQuery.find();
    let moods = [];
    for (let i = 0; i < matches.length; i++) {
      moods.push(await matches[i].get("mood"));
    }

    const allQuery = new Parse.Query(Posts);
    const allMatches = await allQuery.find();
    let allMoods = [];
    for (let i = 0; i < allMatches.length; i++) {
      allMoods.push(await allMatches[i].get("mood"));
    }

    res.status(200).json({ moods, allMoods });
  } catch (err) {
    next(err);
  }
});

// GET: top 20 tracks user has listened to across all time having Spotify using Spotify API
router.get("/:time", async (req, res, next) => {
  try {
    const time = req.params.time;
    var options = {
      url: `https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=${time}`,
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
