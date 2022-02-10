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

  const queryParams = new URLSearchParams({
    seed_genres: genre,
    limit: 12
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
router.get('/start', async (req, res) => {
  const { device_id } = req.query;
  const { accessToken, tracks } = req.session;

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
      res.status(200).json({ tracks });
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json('Error setting user\'s Playback SDK: ', error);
      res.end();
    });
});

// PUT request to transfer playback to our app.
router.get('/playback', async (req, res) => {
  const { accessToken } = req.session;
  const { device_id } = req.query;

  await axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: JSON.stringify({
      device_ids: [device_id]
    })
  })
    .then(() => {
      res.status(200).json('Successfully transfered user\'s playback to app.');
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json('Error transfering user\'s playback: ', error);
      res.end();
    });
});

// GET request to make POST request to create playlist with spotify's user_id
router.get('/playlist/create', async (req, res) => {
  const { accessToken, user } = req.session;
  await axios({
    method: 'POST',
    url: `https://api.spotify.com/v1/users/${user.user_id}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: JSON.stringify({
      name: 'Tinder Music',
      description: 'Playlist from tinder music game.'
    })
  })
    .then((response) => {
      const { data } = response;
      req.session.playlist = { playlist_id: data.id };
      res.status(200).json('Successfully created a playlist.');
      res.end();
    })
    .catch((error) => {
      console.log('Error: ', error);
      res.status(400).json('Error creating a playlist.');
      res.end();
    });
});

// PUT request that sends a POST request to add app's tracks to 'Tinder Music' playlist
router.put('/playlist/submit', async (req, res) => {
  const { accessToken, playlist } = req.session;
  const { uris, position } = req.body;

  await axios({
    method: 'POST',
    url: `https://api.spotify.com/v1/playlists/${playlist.playlist_id}/tracks`,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: JSON.stringify({
      uris,
      position
    })
  })
    .then(() => {
      res.status(200).json('Successfully added songs to Tinder Music playlist.');
      res.end(); 
    })
    .catch((error) => {
      console.log('Error: ', error);
      res.status(400).json('Error adding songs to Tinder Music playlist.');
      res.end();
    });
});

module.exports = router;

