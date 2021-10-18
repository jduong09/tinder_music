const express = require('express');
const request = require('request');
require('dotenv').config();

const port = 5000;

global.access_token = '';

const spotify_client_id = process.env.spotifyClientId;
const spotify_client_secret = process.env.spotifyClientSecret;
const spotify_redirect_uri = process.env.spotifyRedirectUri;

let app = express();

app.get('/auth/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private';

  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + searchParams.toString());
});

app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    }
  });

});

app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});