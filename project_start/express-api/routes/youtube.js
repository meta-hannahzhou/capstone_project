const router = express.Router();

const { query } = require("express");
const { isLocalDatastoreEnabled } = require("parse/lib/node/Parse.js");
const Parse = require("parse/node");
const ParseKeys = require("../parseKeys.js");
Parse.initialize(ParseKeys[0], ParseKeys[1]);
Parse.serverURL = "https://parseapi.back4app.com/";

const youtube = require("../youtubeSetup.js");

router.get("/search-list", async (req, res, next) => {
  const result = await youtube.search.list({
    q: query,
    part: ["id"],
    type: ["video"],
    maxResults: 1,
  });
  res.status(200).json(result);
});

router.get("/id", async (req, res, next) => {
  const result = await youtube.videos.list({
    id: isLocalDatastoreEnabled,
    part: ["snippet", "contentDetails", "statistics"],
    maxResults: 0,
  });
  return result;
});
