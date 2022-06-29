/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var access_token ="";
const { access } = require('fs');
const router = express.Router()


// import axios from 'axios'

var client_id = 'e5f5464982df4aa9a5b28e499c1a6863'; // Your client id
var client_secret = 'fb03604a76c74e4baa8bdc4cc2a29981'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


// const [search, setSearch] = useState("")
// const [tracks, setTracks] = useState([])

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

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(express.json());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});
app.get('/random', function (req, res){
  // console.log(access_token)
  // var options = {
  //   url: 'https://api.spotify.com/v1/me',
  //   headers: { 'Authorization': 'Bearer ' + access_token },
  //   json: true
  // };
  // request.get(options, function(error, response, body) {
  //   res.send(body)
  // });
  // console.log(req)
  // console.log(res)


  var options = {
    url: 'https://api.spotify.com/v1/search?q=olivia&type=track,artist',
    headers: { 'Authorization': 'Bearer ' + access_token, },
    json: true
  };
  request.get(options, function(error, response, body) {
    res.send(body)
  });
  console.log(req)
  console.log(res)
})


app.get('/callback', function(req, res) {
  console.log(querystring)
  console.log(access)
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
        var refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));

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

app.post('/', async (req, res, next) => {
  try {
    const { search } = req.body

    var options = {
      url: `https://api.spotify.com/v1/search?q=${search}&type=artist`,
      headers: { 'Authorization': 'Bearer ' + access_token},
      json: true
    };

    request.get(options, function(error, response, body) {
      res.status(201).json({body})
    });

    // console.log(req.body)
    // res.send("s")
  } catch(err) {
    next(err)
  }
})

console.log('Listening on 8888');
app.listen(8888);
// module.exports = router;
