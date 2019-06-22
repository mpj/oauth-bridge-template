let express = require('express');
let request = require('request');
let querystring = require('querystring');

let app = express();

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback';

app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-playback-state playlist-modify-public playlist-modify-private',
      redirect_uri
    }));
});

app.get('/callback', function (req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };
  request.post(authOptions, (error, response, body) => {
    try {
      let accessToken = body.access_token;
      let uri = process.env.FRONTEND_URI || 'http://localhost:8080';
      res.redirect(uri + '?access_token=' + accessToken);
    } catch {
      console.error(error)
    }
  });
});

let port = process.env.PORT || 8888;
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`);
app.listen(port);