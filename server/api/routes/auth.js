const express = require('express');
const qs = require('querystring');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

const { spotifyClientId, spotifyClientSecret, spotifyRedirectUri  } = process.env;

// authorize app to make request to spotify's app. 
router.get('/login', (req, res) => {
  // transfer playback to this device requires 'user-modify-playback-state' scope
  const scope = 'streaming user-read-email user-read-private user-modify-playback-state playlist-modify-public';

  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyClientId,
    scope: scope,
    redirect_uri: spotifyRedirectUri,
    show_dialog: true
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + searchParams.toString());
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const { session } = req;
  await axios({
    method: 'POST', 
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      code,
      redirect_uri: spotifyRedirectUri,
      grant_type: 'authorization_code'
    })
  })
  .then((response) => {
    const { data } = response;
    session.accessToken = data.access_token;
    res.redirect('/');
    res.end();
  })
  .catch((error) => {
    console.log(error);
    res.redirect('/');
    res.end();
  });
});

// Get request to /auth/token on local server to set the global access_token to the response access_token
router.get('/token', async (req, res) => {
  const { session } = req;
  if (session.accessToken) {
    await res.status(200).json(session.accessToken);
    return res.end();
  }
  await res.status(400).json('No token found');
  res.end();
});

router.get('/user', async (req, res) => {
  const { accessToken } = req.session;
  
  await axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me?' + new URLSearchParams({ access_token: accessToken })
  }).then((response) => {
      const { data } = response;
      req.session.user = { user_id: data.id };
      res.status(200).send({ displayName: data.display_name, pfp: data.images[0].url });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send('Could not find user.');
      res.end();
    });
});

router.get('/logout', async (req, res) => {
  req.session = null;
  res.clearCookie('tinderMusic');
  res.redirect('/');
  res.end();
});

module.exports = router;