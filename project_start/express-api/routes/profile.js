const express = require("express");
const router = express.Router();
var request = require("request");
const ParseKeys = require("../parseKeys.js");

const Parse = require("parse/node");

Parse.initialize(ParseKeys[0], ParseKeys[1]);
Parse.serverURL = "https://parseapi.back4app.com/";

// GET: get basic profile information from Spotify API
router.get("/", async (req, res, next) => {
  try {
    var options = {
      url: `https://api.spotify.com/v1/me`,
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

// GET: get info about all posts a user has liked
router.get("/liked/:userObjectId", async (req, res, next) => {
  try {
    const userObjectId = req.params.userObjectId;
    const Likes = Parse.Object.extend("Likes");
    const likeQuery = new Parse.Query(Likes);
    likeQuery.equalTo("userObjectId", userObjectId);

    const result = await likeQuery.find();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// GET: get info about all posts a user has commented on
router.get("/commented/:userObjectId", async (req, res, next) => {
  try {
    const userObjectId = req.params.userObjectId;

    const Comments = Parse.Object.extend("Comments");
    const commentQuery = new Parse.Query(Comments);
    commentQuery.equalTo("userObjectId", userObjectId);

    const result = await commentQuery.find();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// GET: get all the posts user has made
router.get("/posted", async (req, res, next) => {
  try {
    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    postQuery.descending("createdAt");
    postQuery.equalTo("userId", req.app.get("userId"));
    const posted = await postQuery.find();

    res.status(200).json(posted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
