const express = require("express");
const router = express.Router();

const Parse = require("parse/node");
const ParseKeys = require("../parseKeys.js");
Parse.initialize(ParseKeys[0], ParseKeys[1]);
Parse.serverURL = "https://parseapi.back4app.com/";

const youtube = require("../youtubeSetup.js");

router.get("/search-list", async (req, res, next) => {
  const result = await youtube.search.list({
    q: req.body.query,
    part: ["id"],
    type: ["video"],
    maxResults: 1,
  });
  const videoId = result.data.items[0].id.videoId;
  console.log(videoId);
  const getIdResults = await youtube.videos.list({
    id: videoId,
    part: ["statistics"],
    maxResults: 1,
  });

  const youtubeStatistics = getIdResults.data.items[0].statistics;

  res.status(200).json(youtubeStatistics);
});

// router.get("/id", async (req, res, next) => {
//   console.log("reached inside!!!!!");
//   console.log(req.body.id);
//   const result = await youtube.videos.list({
//     id: [req.body.id],
//     part: ["snippet", "contentDetails", "statistics"],
//     maxResults: 1,
//   });
//   res.status(200).json(result);
// });

module.exports = router;
