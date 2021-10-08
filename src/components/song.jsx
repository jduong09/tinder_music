import React from 'react';

class Song extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      artist: "",
      album: ""
    };
  };

  componentDidMount() {
    const client_id = 'CLIENT_ID';
    const client_secret = 'CLIENT_SECRET';
    const baseencodedClientCredentials = btoa(`${client_id}:${client_secret}`);
    const url = 'https://accounts.spotify.com/api/token';

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Basic ${baseencodedClientCredentials}`);
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

    
    fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: 'grant_type=client_credentials'
    })
      .then(data => data.json())
      .then(res => res.access_token).then(accessToken => 
        fetch("https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp", {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        })
          .then(finalData => finalData.json())
          .then(res => res.name))
          .then(name => this.setState({name : name}));
    }

  render() {
    return <div>{this.state.name}</div>;
  }
};

export default Song;