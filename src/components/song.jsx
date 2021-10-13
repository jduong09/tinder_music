import React from 'react';

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
    //const baseencodedClientCredentials = btoa(`${client_id}:${client_secret}`);
    //const myHeaders = new Headers();
    //myHeaders.append('Authorization', `Basic ${baseencodedClientCredentials}`);
    //myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    const searchParams = new URLSearchParams({
      scope: ["streaming", "user-read-email", "user-read-private", "user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"],
      redirect_uri: 'http://localhost:3000/auth/callback',
      response_type: 'token',
      client_id: client_id
    });

    const url = 'https://accounts.spotify.com/authorize/?' + searchParams.toString();
    this.requestAccessToken(url);
  };

  requestAccessToken(url) {
    fetch(url, {
      mode: 'cors'
    }).then(data => console.log(data), error => console.log(error));
    /*
    .then(data => data.json())
    .then(res => {
      console.log(res);
      window.accessToken = res.access_token;
      return res.access_token;
    })
    .then(accessToken => {
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
  */
  };

  
  initializeSpotifyWebPlayer(accessToken) {
    console.log(accessToken);
    window.accessToken = accessToken;
  };

  render() {
    return (
      <div>
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