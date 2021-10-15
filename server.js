const express = require('express');
const request = require('request');

const port = 5000;

global.access_token = '';

const spotify_client_id = 'd63fc97ff8f84a7bb58d1d9cf73ecfed';
const spotify_client_secret = 'a2d83594e53642be961588d675d12828';
const spotify_redirect_uri = 'http://localhost:3000/auth/callback';

let app = express();

app.get('/auth/login', (req, res) => {
  let scope = 'streaming user-read-email user-read-private';

  let searchParams = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + searchParams.toString());
});

app.get('/auth/callback', (req, res) => {
  let code = req.query.code;

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
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