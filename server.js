const express = require('express');
const request = require('request');
require('dotenv').config();

const port = 5000;

global.access_token = '';
global.id = '';
global.playlist_id = '';

const spotify_client_id = process.env.spotifyClientId;
const spotify_client_secret = process.env.spotifyClientSecret;
const spotify_redirect_uri = process.env.spotifyRedirectUri;

let app = express();

app.use(express.json());

app.get('/auth/login', (req, res) => {
  // transfer playback to this device requires 'user-modify-playback-state' scope
  const scope = 'streaming user-read-email user-read-private user-modify-playback-state playlist-modify-public';

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
      // grab access token from request to spotify, change global variable access_token.
      access_token = body.access_token;
      res.redirect('/');
    };
  });
});

// Get request to /auth/token on local server to set the global access_token to the response access_token
app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token });
});

app.get('/auth/playback/', (req, res) => {
  // PUT request to transfer playback to our app.
  // request body: our device id
  const deviceId = req.query.device_id;
  const options = {
    url: 'https://api.spotify.com/v1/me/player',
    body: JSON.stringify({
      device_ids: [deviceId]
    }),
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Accept': 'application/json'
    }
  }

  request.put(options, function(error, response, body) {
    if (!error && response.statusCode == 204) {
      res.end();
    }
  });
});

//express route to create playlist
// get request to grab current user's information, specifically user_id
// create playlist with spotify's user_id
app.get('/auth/user', (req, res) => {
  const searchParams = new URLSearchParams({
    access_token: access_token
  });

  user_id = request('https://api.spotify.com/v1/me?' + searchParams.toString(), (error, response, body) => {
    // request current user's information, in order to create a new playlist for them.  
    const data = JSON.parse(body);
    const user_id = data.id;
    const playlistOptions = {
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        'name': 'Tinder Music',
        'description': 'Playlist for tinder music'
      },
      json: true
    };
  
    request.post(playlistOptions, function(error, response, body) {
      if (!error) {
        // create playlist id global variable
        playlist_id = body.id;
        res.end();
      }
    });
  });
});

app.post('/auth/playlist', (req, res) => {
  // express server receives spotify uri, and position from front-end
  const data = req.body;
  // make a post request to spotify api, sending spotify uris (array) and position (string)
  // to insert into playlist titled 'Tinder Music'
  // POST /playlists/{playlist_id}/tracks
  const newPlaylistOptions = {
    url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'uris': data.uris,
      'position': data.position
    })
  };

  request.post(newPlaylistOptions, function(error, response, body) {
    if (!error) {
      res.end();
    }
  })
});

// Get request to get recommendations according to genre given. 
app.get('/auth/seed', (req, res) => {
  const data = req.query;
  // GET /recommendations
  // Query:
    // seed_artists (string)
    // seed_genres (string)
    // seed_tracks (string)
    // limit (integer)

  const queryParams = new URLSearchParams({
    seed_genres: data.genre,
    limit: 1
  });

  const seedOptions = {
    url: ('https://api.spotify.com/v1/recommendations?' + queryParams.toString()),
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  request.get(seedOptions, function(error, response, body) {
    if (!error) {
      const data = JSON.parse(body);
      const tracks = data.tracks;
      console.log(tracks[0]);
    } else {
      console.log(error);
    }
    res.end();
  })
});

// Get Request to /recommendations/available-genre-seeds
app.get('/auth/genres', (req, res) => {

  let genres = '';

  const options = {
    url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  request.get(options, function(error, response, body) {
    if (!error) {
      const data = JSON.parse(body);
      genres = data.genres;
    } else {
      console.log(error);
    };
    res.json({ genres: genres });
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});