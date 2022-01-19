const express = require('express');
/* 
Uninstalled: request is deprecated
const request = require('request');
*/
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

const { spotifyClientId, spotifyClientSecret, spotifyRedirectUri  } = process.env;

// authorize app to make request to spotify's app. 
router.get('/login', (req, res) => {
  // transfer playback to this device requires 'user-modify-playback-state' scope
  console.log(req.session);
  const scope = 'streaming user-read-email user-read-private user-modify-playback-state playlist-modify-public';

  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyClientId,
    scope: scope,
    redirect_uri: spotifyRedirectUri
  });

  // redirect browser to spotify's authorize page.
  res.redirect('https://accounts.spotify.com/authorize/?' + searchParams.toString());
});

router.get('/callback', (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: JSON.stringify({
      code,
      redirect_uri: spotifyRedirectUri,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
      'Content-Type': 'application/json'
    },
     
  };

  axios.post(authOptions, function(error, response, body) {
    conso
    if (!error && response.statusCode === 200) {
      const { session } = req;
      session.tinderMusic.accessToken = body.access_token;
      res.redirect('/');
    };
  });
});

// Get request to /auth/token on local server to set the global access_token to the response access_token
router.get('/token', (req, res) => {
  console.log('SESSION: ', req.session);
  const { tinderMusic } = req.session;
  console.log(tinderMusic);
  if (tinderMusic) {
    res.status(200).json(tinderMusic.accessToken);
  }
  res.redirect('/');
  res.end();
});

router.get('/user', (req, res) => {
  const searchParams = new URLSearchParams({
    access_token: global.access_token
  });

  axios('https://api.spotify.com/v1/me?' + searchParams.toString(), (error, response, body) => {
    // request current user's information, in order to create a new playlist for them.  
    const data = JSON.parse(body);
    global.user_id = data.id;
    res.send({ pfp: data.images[0].url, displayName: data.display_name });
    res.end();
  });
});

module.exports = router;