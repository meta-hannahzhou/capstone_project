/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

// const path = require('path');
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const port = process.env.PORT || 8888;

// const publicPath = path.join(__dirname, '..', 'public');


var access_token ="";
var userId = "";

const Post = require('./routes/post.js')
const Recommendations = require('./routes/recommendations.js')
const Statistics = require('./routes/statistics.js')
const Profile = require('./routes/profile.js')

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
// Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.initialize("jf8fBQCKtSE8fxxzMlARZZYxGgbMwLA2l9tAfwSU", "z25hAbCBiOVPkYzHIJt8PXLjZxKTDhsuvhMaVtuM")
Parse.serverURL = "https://parseapi.back4app.com/"


var client_id = 'dde109facc9446bd95991893064d1a5c'; // Your client id
var client_secret = 'bcdd6a7acf314244abb9063240a8599e'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

// app.use(() => {})
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
// app.use(express.static(publicPath));

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(express.json());


// Generate API key for login and redirect to Spotify authorization page
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// Login to page and redirect to home/feed page of website
app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        access_token = body.access_token;
        app.set('access_token', access_token)

        // req.session.key = body.access_token
        var refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          userId = body.id
          app.set('userId', body.id)
        });

        res.redirect("http://localhost:3000/home")
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// Create new token after token expires (every hour)
app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


app.use('/post', Post)
app.use('/recommendations', Recommendations)
app.use('/statistics', Statistics)
app.use('/profile', Profile)


// Initialize Login table and check if user has previously logged in already
app.post('/', async (req, res, next) => {
  try {
    const Login = Parse.Object.extend("Login");
    const loginQuery = new Parse.Query(Login)
    loginQuery.equalTo("userId", userId);
    const checkSong = await loginQuery.find();
    if (checkSong.length == 0) {
      const login = new Login();
      login.set("userId", userId)
      const userLogin = await login.save()
      res.status(200).json(userLogin)
    } else {
      res.status(200).json(checkSong[0]);  
    }
  } catch(err) {
    next(err)
  }
  

})


// GET: all posts in a user's feed sorted reverse chronologically
app.get('/feed', async (req, res, next) => {
  try {
    const Posts = Parse.Object.extend("Posts");
    const query = new Parse.Query(Posts);
    query.descending("createdAt")
    query.limit(10)
    const response = await query.find()
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
})



// GET: all genres for a certain song (will be used later for statistics and recommendations)
app.get('/genre/:artistId', async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    var options = {
      url: `https://api.spotify.com/v1/artists/${artistId}`,
      headers: { 'Authorization': 'Bearer ' + access_token},
      json: true
    };

    request.get(options, function(error, response, body) {
      res.status(200).json(body.genres)
    });
  } catch (err) {
    next(err)
  }
})

// GET: all genres for a certain song (will be used later for statistics and recommendations)
app.get('/post-genre/:selectedSongId', async (req, res, next) => {
  const selectedSongId = req.params.selectedSongId;
  try {
    const Songs = Parse.Object.extend("Songs");
    const songQuery = new Parse.Query(Songs)
    songQuery.equalTo("selectedSongId", selectedSongId);
    const response = await songQuery.find();
    const genres = await response[0].get("genres")
    res.status(200).json(genres)
    
  } catch (err) {
    next(err)
  }
})


// app.listen(8888);
app.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
