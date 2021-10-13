const express = require('express');
const request = require('request');

const port = 5000;

global.access_token = '';

const client_id = 'client_id';
const client_secret = 'client_secret';

let app = express();

app.get('/auth/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private';

  const searchParams = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: 'http://localhost:3000/auth/callback'
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + searchParams.toString());
});

app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:3000/auth/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
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