const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/playback', (req, res) => {
  // PUT request to transfer playback to our app.
  // request body: our device id
  const deviceId = req.query.device_id;
  const options = {
    url: 'https://api.spotify.com/v1/me/player',
    body: JSON.stringify({
      device_ids: [deviceId]
    }),
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Accept': 'application/json'
    }
  };

  axios.put(options, function(error, response, body) {
    if (!error && response.statusCode === 204) {
      res.end();
    }
  });
});

// Create playlist with spotify's user_id
router.get('/api/playlist/create', (req, res) => {
  const playlistOptions = {
    url: `https://api.spotify.com/v1/users/${global.user_id}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: {
      'name': 'Tinder Music',
      'description': 'Playlist for tinder music'
    },
    json: true
  };

  axios.post(playlistOptions, function(error, response, body) {
    if (!error) {
      // create playlist id global variable
      global.playlist_id = body.id;
      res.end();
    }
  });
});

router.post('/playlist', (req, res) => {
  // express server receives spotify uri, and position from front-end
  const data = req.body;
  // make a post request to spotify api, sending spotify uris (array) and position (string)
  // to insert into playlist titled 'Tinder Music'
  // POST /playlists/{playlist_id}/tracks
  const newPlaylistOptions = {
    url: `https://api.spotify.com/v1/playlists/${global.playlist_id}/tracks`,
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'uris': data.uris,
      'position': data.position
    })
  };

  axios.post(newPlaylistOptions, function(error, response, body) {
    if (!error) {
      res.end();
    }
  })
});

// Get Request to /recommendations/available-genre-seeds
router.get('/genres', (req, res) => {

  let genres = '';

  const options = {
    url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  axios.get(options, function(error, response, body) {
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

// Get request to get recommendations according to genre given. 
router.get('/seed', (req, res) => {
  const data = req.query;
  // GET /recommendations
  // Query:
    // seed_artists (string)
    // seed_genres (string)
    // seed_tracks (string)
    // limit (integer)

  const queryParams = new URLSearchParams({
    seed_genres: data.genre,
    limit: 10
  });

  const seedOptions = {
    url: ('https://api.spotify.com/v1/recommendations?' + queryParams.toString()),
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  axios.get(seedOptions, function(error, response, body) {
    if (!error) {
      const data = JSON.parse(body);
      const tracks = data.tracks;
      tracks.forEach(track => {
        console.log(track.name);
        global.tracks.push(track.uri);
      });
    } else {
      console.log(error);
    }
    res.end();
  })
});

// PUT request to me/player/play (Start/Pause User Playback)
// Query: device_id (string)
// Body: 
  // context_uri (string)
  // uris (array of strings)
  // position_ms
router.get('/start', (req, res) => {
  const device_id = req.query.device_id;

  const options = {
    url: `https://api.spotify.com/v1/me/player/play/?device_id=${device_id}`,
    headers: {
      'Authorization': 'Bearer ' + global.access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'uris': global.tracks
    })
  };

  axios.put(options, function(error, response, body) {
    if (!error) {
      console.log(response.statusCode);
    } else {
      console.log(error);
    };
  });

  res.end();
});

module.exports = router;
