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
var userId = "";

// const Post = require('./routes/post.js')

const Parse = require('parse/node');
// Will later store these as environment variables for much strong security
Parse.initialize("01pRqpOPIL2CPOmyCXOdjQM81JoDXgHXyEYvC8xa", "OBHnma2duz3UjloQLiuD9dIMi4qLKeEMdurNgQ58")
Parse.serverURL = "https://parseapi.back4app.com/"


var client_id = 'dde109facc9446bd95991893064d1a5c'; // Your client id
var client_secret = 'bcdd6a7acf314244abb9063240a8599e'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

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

// app.use('/post', Post)

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


app.post('/search', async (req, res, next) => {
  try {
    const { search } = req.body

    var options = {
      url: `https://api.spotify.com/v1/search?q=${search}&type=track&limit=8`,
      headers: { 'Authorization': 'Bearer ' + access_token},
      json: true
    };

    request.get(options, function(error, response, body) {
      res.status(201).json({body})
    });

  } catch(err) {
    next(err)
  }
})

app.post('/new-post', async (req, res, next) => {
  try {
    const { selectedSongId, selectedSongUrl, selectedSongName, review, mood, rating } = req.body
    const Posts = Parse.Object.extend("Posts");
    const post = new Posts();

    post.set({
      "selectedSongId": selectedSongId,
      "selectedSongUrl": selectedSongUrl,
      "selectedSongName": selectedSongName,
      "review": review, 
      "mood": mood, 
      "rating": rating,
      "userId": userId,
      "likes": 0,
      "comments": []
    })

    post.save()
    res.send({"post completed": "success"})
  } catch (err) {
    next(err)
  }
}) 

app.post('/new-comment', async (req, res, next) => {
  try {
 
    // Adding new comment to Comments database
    const { postId, selectedSongId, comment} = req.body
    const Comments = Parse.Object.extend("Comments");
    const currComment = new Comments();
    currComment.set({
      "comment": comment,
      "selectedSongId": selectedSongId,
    })
    
    // Updating Posts database and appending comment id to commments field
    const Posts = Parse.Object.extend("Posts");
    const query = new Parse.Query(Posts);
    const post = await query.get(postId)

    currComment.set("postId", post)
    const savedComment = await currComment.save()
    
    res.status(200).json(savedComment)
    
  } catch (err) {
    next(err)
  }
}) 

app.post('/comments', async (req, res, next) => {
  const { postId } = req.body

  try {
    const Comments = Parse.Object.extend("Comments");
    const commentQuery = new Parse.Query(Comments)

    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    const post = await postQuery.get(postId)

    commentQuery.equalTo("postId", post)
    const results = await commentQuery.find()
    console.log(results)
    res.status(200).json(results)
  } catch (err) {
    next(err)
  }
})

app.post('/get-likes', async (req, res, next) => {
  const { postId } = req.body

  try {
    const Posts = Parse.Object.extend("Posts");
    const postQuery = new Parse.Query(Posts);
    const post = await postQuery.get(postId)

    res.status(200).json(post)
  } catch (err) {
    next(err)
  }
})

app.put('/update-post', async (req, res, next) => {
  const {postObjectId, commentObjectId} = req.body 

  const Posts = Parse.Object.extend("Posts");
  const query = new Parse.Query(Posts);
  const post = await query.get(postObjectId)
  
  let currComments = await post.get("comments")
  currComments.push(commentObjectId)
  post.set("comments", currComments)
  post.save()
  res.status(200).json(currComments)
})

app.post('/', async (req, res, next) => {
  const Login = Parse.Object.extend("Login");
  const login = new Login();
  login.set("userId", userId)
  const userLogin = await login.save()
  res.status(200).json(userLogin)
})

// app.get('/', async ())

app.get('/feed', async (req, res, next) => {
  try {
    

    const Posts = Parse.Object.extend("Posts");
    const query = new Parse.Query(Posts);
    const response = await query.find()
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
})

app.put('/like', async (req, res, next) => {
  const { postId, userObjectId } = req.body
  console.log(postId)

  const Users = Parse.Object.extend("Login");
  const userQuery = new Parse.Query(Users);
  const user = await userQuery.get(userObjectId)

  console.log(user)

  const Posts = Parse.Object.extend("Posts");
  const postQuery = new Parse.Query(Posts);
  const post = await postQuery.get(postId)
  post.increment("likes")
  console.log(post)

  const relation = user.relation("likes")
  relation.add(post)
  console.log(relation)
  user.save()
  post.save()
  console.log(user)
  res.send({user, post})
})

app.get('/profile', async (req, res, next) => {
  try {
    var options = {
      url: `https://api.spotify.com/v1/me`,
      headers: { 'Authorization': 'Bearer ' + access_token},
      json: true
    };

    request.get(options, function(error, response, body) {
      res.status(200).json({body})
    });

  } catch(err) {
    next(err)
  }
})

app.get('/statistics', async (req, res, next) => {
  try {
    var options = {
      url: `https://api.spotify.com/v1/me/top/tracks?offset=0&limit=20&time_range=long_term`,
      headers: { 'Authorization': 'Bearer ' + access_token},
      json: true
    };

    request.get(options, function(error, response, body) {
      res.status(200).json({body})
    });

  } catch(err) {
    next(err)
  }
})


console.log('Listening on 8888');
app.listen(8888);
// module.exports = router;
