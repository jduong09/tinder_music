const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get Request to /recommendations/available-genre-seeds
router.get('/genres', async (req, res) => {
  await axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    headers: {
      'Authorization': `Bearer ${req.session.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => {
    const { data } = response;
    res.status(200).json(data);
  })
  .catch(error => {
    console.log(error);
    res.status(400).json('Failed to fetch genres.');
  });
});

// Get request to get recommendations according to genre given. 
router.get('/seed', async (req, res) => {
  const { genre } = req.query;
  const { accessToken } = req.session;
  // GET /recommendations
  // Query:
    // seed_artists (string)
    // seed_genres (string)
    // seed_tracks (string)
    // limit (integer)

  const queryParams = new URLSearchParams({
    seed_genres: genre,
    limit: 2
  });

  await axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/recommendations?' + queryParams,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then((response) => {
      const { data } = response;
      // Send seed data to req.session. 
      // Grab seed data in /start and use that to play seed data on browser.
      const tracksUri = data.tracks.map((track) => track.uri);
      req.session.tracks = tracksUri;
      res.status(200).json('Successfully seeded data.');
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json('Failed to get seed data.');
      res.end();
    });
});

// PUT request to me/player/play (Start/Pause User Playback)
// Query: device_id (string)
// Body: 
  // context_uri (string)
  // uris (array of strings)
  // position_ms
router.get('/start', async (req, res) => {
  const { device_id } = req.query;
  const { accessToken, tracks } = req.session;
  console.log('Session in /start: ', req.session);

  await axios({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/play/?device_id=${device_id}`,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      'uris': tracks
    })
  })
    .then(() => {
      res.status(200).json('successfully started web playback sdk');
      res.end();
    })
    .catch(error => console.log(error));

  /*
  axios.put(options, function(error, response, body) {
    if (!error) {
      console.log(response.statusCode);
    } else {
      console.log(error);
    };
  });
  */
});

/*
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
*/

/*
// Create playlist with spotify's user_id
router.get('/playlist/create', (req, res) => {
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

*/

module.exports = router;

