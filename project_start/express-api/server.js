/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var brain = require("brain.js");
const model = require("wink-eng-lite-model");
const nlp = require("wink-nlp")(model);
const its = nlp.its;

const ParseKeys = require("./parseKeys.js");

const port = process.env.PORT || 8888;

var access_token = "";
let userId = "";

const Post = require("./routes/post.js");
const Recommendations = require("./routes/recommendations.js");
const Statistics = require("./routes/statistics.js");
const Profile = require("./routes/profile.js");
const YouTube = require("./routes/youtube.js");

const Parse = require("parse/node");

Parse.initialize(ParseKeys[0], ParseKeys[1]);
Parse.serverURL = "https://parseapi.back4app.com/";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://calm-mesa-23172.herokuapp.com"
    : "http://localhost:8888";
let baseRedirectUrlReal = "";

var client_id = "dde109facc9446bd95991893064d1a5c"; // Your client id
var client_secret = "bcdd6a7acf314244abb9063240a8599e"; // Your secret
var redirect_uri = `${baseUrl}/callback`; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser())
  .use(express.json());

app.get("/", function (req, res) {
  res.send(process.env.NODE_ENV);
});

// Generate API key for login and redirect to Spotify authorization page
app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
    "user-read-private user-read-email user-top-read user-read-recently-played";
  // res.send(redirect_uri)
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.post("/frontend-url", function (req, res) {
  const { baseRedirectUrl } = req.body;
  baseRedirectUrlReal = baseRedirectUrl;
  res.send("Succesfully posted frontend url");
});

// Login to page and redirect to home/feed page of website
app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        app.set("access_token", access_token);

        var refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          userId = body.id;
          app.set("userId", body.id);
        });

        res.redirect(`${baseRedirectUrlReal}home`);
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

// Create new token after token expires (every hour)
app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.use("/post", Post);
app.use("/recommendations", Recommendations);
app.use("/statistics", Statistics);
app.use("/profile", Profile);
app.use("/youtube", YouTube);

// Initialize Login table and check if user has previously logged in already
app.post("/", async (req, res, next) => {
  try {
    const Login = Parse.Object.extend("Login");
    const loginQuery = new Parse.Query(Login);

    loginQuery.equalTo("userId", userId);
    const checkSong = await loginQuery.find();
    if (checkSong.length == 0) {
      const login = new Login();
      login.set("userId", userId);
      const userLogin = await login.save();

      const Recommendation = Parse.Object.extend("Recommendation");
      const rec = new Recommendation();
      rec.set({
        userId: userId,
        postedGenres: {},
        likedGenres: {},
        commentedGenres: {},
        topGenres: {},
        dance: 0,
        acoust: 0,
        live: 0,
        max1: "dance",
        max2: "acoust",
        mlModel: {},
        topMLSong: {},
      });
      await rec.save();

      const TopSongs = Parse.Object.extend("TopSongs");
      const topSongs = new TopSongs();
      topSongs.set({
        userId: userId,
        topGenre: {},
      });

      await topSongs.save();

      res.status(200).json(userLogin);
    } else {
      res.status(200).json(checkSong[0]);
    }
  } catch (err) {
    next(err);
  }
});

const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
  Task,
} = require(`toad-scheduler`);

const scheduler = new ToadScheduler();

const net = new brain.NeuralNetwork({
  activation: "sigmoid",
  hiddenLayers: [3],
  iterations: 200,
  learningRate: 0.5,
});

const getAccuracy = function (net, testData) {
  let hits = 0;
  testData.forEach((datapoint) => {
    const output = net.run(datapoint.input);
    if (Math.round(output[0]) === datapoint.output[0]) {
      hits += 1;
    }
  });
  return hits / testData.length;
};

// Initializing new task for ML Prediction
const task = new AsyncTask("ML Prediction", async () => {
  if (userId.length != 0) {
    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", userId);
    const response = await recQuery.first();

    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    postQuery.equalTo("userId", userId);
    postQuery.select("songId");
    const songIds = await postQuery.find();
    const postedIds = songIds.map((songId) => {
      const vals = songId.attributes;
      return vals["songId"];
    });

    const Songs = Parse.Object.extend("Songs");
    const inputQuery = new Parse.Query(Songs);

    inputQuery.select(
      "speech",
      "vale",
      "energy",
      "acoust",
      "instru",
      "live",
      "dance",
      "songId"
    );

    const outputQuery = new Parse.Query(Songs);
    outputQuery.select("avgRating");

    return inputQuery.find().then((input) => {
      let samples = [];

      // Get input data to be trained
      for (let i = 0; i < input.length; i++) {
        const { songId, dance, energy, speech, acoust, instru, live, vale } =
          input[i].attributes;
        if (postedIds.includes(songId)) {
          samples.push([dance, energy, speech, acoust, instru, live, vale]);
        }
      }

      // Get labels for machine learning model
      outputQuery.find().then((result) => {
        const labels = result.map((item) => {
          const { avgRating } = item.attributes;
          return [avgRating / 5];
        });

        const trainData = samples.map((sample, index) => {
          return {
            input: sample,
            output: labels[index],
          };
        });

        // Train model
        const { error, iterations } = net.train(trainData);

        // Save trained model as json file which can be saved in table
        const netAsJson = net.toJSON();
        response.set("mlModel", netAsJson);
        response.save();
      });
    });
  }
});

const BM25Vectorizer = require("wink-nlp/utilities/bm25-vectorizer");
const bm25 = BM25Vectorizer();
const corpus = require("./fileToArray.js");

corpus.forEach((doc) => {
  bm25.learn(nlp.readDoc(doc).tokens().out(its.normal));
});

// Initializing new task for NLP TF-IDF Recommendation
const nlpTask = new Task("TF-IDF", async () => {
  if (userId.length != 0) {
    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    postQuery.equalTo("userId", userId);
    const response = await postQuery.find();

    const Comments = Parse.Object.extend("Comments");

    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", userId);
    const recResponse = await recQuery.first();

    const currMaxTfIdf = await recResponse.get("topTFSong");
    let currMaxScore = currMaxTfIdf["score"];
    let currMaxId = currMaxTfIdf["songId"];

    for (let i = 0; i < response.length; i++) {
      const postComments = await response[i].get("comments");
      let currDoc = "";
      if (postComments.length != 0) {
        for (let j = 0; j < postComments.length; j++) {
          const commentQuery = new Parse.Query(Comments);
          const currParseComment = await commentQuery.get(postComments[j]);
          const currComment = await currParseComment.get("comment");
          currDoc += currComment + " ";
        }
        const tfIdfArr = bm25.vectorOf(
          nlp.readDoc(currDoc).tokens().out(its.normal)
        );
        const reducer = (accumulator, curr) => accumulator + curr;
        const currScore = tfIdfArr.reduce(reducer);
        response[i].set("tfIdfScore", currScore);

        if (currScore > currMaxScore) {
          currMaxScore = currScore;
          currMaxId = await response[i].get("songId");
        }
      } else {
        response[i].set("tfIdfScore", 0);
      }
      await recResponse.set("topTFSong", {
        score: currMaxScore,
        songId: currMaxId,
      });
      await recResponse.save();
      await response[i].save();
    }
  }
});

const job1 = new SimpleIntervalJob({ seconds: 3600 }, task);
const job2 = new SimpleIntervalJob({ seconds: 1800 }, nlpTask);

scheduler.addSimpleIntervalJob(job1);
scheduler.addSimpleIntervalJob(job2);

// GET: all posts in a user's feed sorted reverse chronologically
app.get("/feed", async (req, res, next) => {
  try {
    const Posts = Parse.Object.extend("Posts");
    const query = new Parse.Query(Posts);
    query.descending("score");
    query.limit(10);
    const response = await query.find();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// Updates genre aggregate table (Rec)
app.post("/update-genre", async (req, res, next) => {
  try {
    let currGenres = [];
    const Songs = Parse.Object.extend("Songs");
    const query = new Parse.Query(Songs);

    let queryString = "";
    let scale = 0.25;
    const songId = await req.body.songId;
    query.equalTo("songId", songId);
    const currSong = await query.first();

    const currSongScore = await currSong.get("score");

    if (req.body.updateType == "post") {
      queryString = "postedGenres";
      scale = 0.5;
      currGenres = await req.body.song.data.genres;
    } else if (req.body.updateType === "like") {
      queryString = "likedGenres";
      currGenres = await currSong.get("genres");
    } else {
      queryString = "commentedGenres";
      currGenres = await currSong.get("genres");
    }

    const Recommendation = Parse.Object.extend("Recommendation");
    const recQuery = new Parse.Query(Recommendation);
    recQuery.equalTo("userId", userId);
    const response = await recQuery.first();

    let currQuery = await response.get(queryString);
    let allQuery = await response.get("topGenres");

    const TopSongs = Parse.Object.extend("TopSongs");
    const topSongsQuery = new Parse.Query(TopSongs);
    topSongsQuery.equalTo("userId", userId);
    const topResponse = await topSongsQuery.first();

    for (let i = 0; i < currGenres.length; i++) {
      // Updating topComments, likes, posts respective category
      if (currGenres[i] in currQuery) {
        currQuery[currGenres[i]] = currQuery[currGenres[i]] + 1;
      } else {
        currQuery[currGenres[i]] = 1;
      }

      // Updating topSongs aggregate column
      if (currGenres[i] in allQuery) {
        allQuery[currGenres[i]] = allQuery[currGenres[i]] + scale;
      } else {
        allQuery[currGenres[i]] = scale;
      }
      const songExists = await topResponse.get(currGenres[i]);
      if (
        typeof songExists === "undefined" ||
        currSongScore > songExists["score"]
      ) {
        topResponse.set(currGenres[i].replace(/\s/g, ""), {
          songId: songId,
          score: currSongScore,
        });
      }

      const topGenre = await topResponse.get("topGenre");

      if (
        Object.keys(topGenre).length == 0 ||
        currSongScore > topGenre["score"]
      ) {
        topResponse.set("topGenre", {
          genre: currGenres[i],
          songId: await req.body.songId,
          score: currSongScore,
        });
      }
    }
    response.set(queryString, currQuery);
    response.set("topGenres", allQuery);

    await response.save();
    await topResponse.save();

    res.status(200).send("completed");
  } catch (err) {
    next(err);
  }
});

// GET: all genres for a certain song (will be used later for statistics and recommendations)
app.get("/genre/:artistId", async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    var options = {
      url: `https://api.spotify.com/v1/artists/${artistId}`,
      headers: { Authorization: "Bearer " + access_token },
      json: true,
    };

    request.get(options, function (error, response, body) {
      res.status(200).json(body.genres);
    });
  } catch (err) {
    next(err);
  }
});

// GET: all genres for a certain song (will be used later for statistics and recommendations)
app.get("/post-genre/:songId", async (req, res, next) => {
  const songId = req.params.songId;
  try {
    const Songs = Parse.Object.extend("Songs");
    const songQuery = new Parse.Query(Songs);
    songQuery.equalTo("songId", songId);
    const response = await songQuery.find();
    const genres = await response[0].get("genres");
    res.status(200).json(genres);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {});
