import React from 'react';
import Script from 'react-load-script'

import { createListeners } from '../utils/spotify_web_playback_sdk';

class Song extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      artist: "",
      album: ""
    };

    this.authenticateUser = this.authenticateUser.bind(this);
    this.requestAccessToken = this.requestAccessToken.bind(this);
    this.initializeSpotifyWebPlayer = this.initializeSpotifyWebPlayer.bind(this);
  };

  authenticateUser() {
    const client_id = 'client_id';
    const client_secret = 'client_secret';
    const baseencodedClientCredentials = btoa(`${client_id}:${client_secret}`);
    const url = 'https://accounts.spotify.com/api/token';
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Basic ${baseencodedClientCredentials}`);
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const searchParams = new URLSearchParams({
      scope: ["streaming", "user-read-email", "user-read-private"],
      grant_type: 'client_credentials'
    });

    this.requestAccessToken(url, myHeaders, searchParams);
  };

  requestAccessToken(url, myHeaders, searchParams) {
    fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: searchParams
    })
    .then(data => data.json())
    .then(res => res.access_token)
    .then(accessToken => {
      this.initializeSpotifyWebPlayer(accessToken);
      return fetch("https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp", {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        }
      })
    })
    .then(finalData => finalData.json())
    .then(res => ({ name: res.name, artist: res.artists[0].name, album: res.album.name }))
    .then(response => this.setState({ name: response.name, artist: response.artist, album: response.album }));
  };

  
  initializeSpotifyWebPlayer(accessToken) {
    console.log(accessToken);
    window.accessToken = accessToken;
  };

  render() {
    return (
      <div>
        <button id="togglePlay">Toggle Play</button>
        <button onClick={this.authenticateUser}>Log In</button>
        <ul>
          <li>Name:{this.state.name}</li>
          <li>Artist:{this.state.artist}</li>
          <li>Album:{this.state.album}</li>
        </ul>
      </div>
    );
  }
};

export default Song;