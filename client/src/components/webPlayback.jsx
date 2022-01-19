import React from 'react';
// import axios from 'axios';

const track = {
  name: '',
  album: {
    images: [
      { url: '' }
    ]
  },
  artists: [
    { name: '' }
  ]
};

class WebPlayback extends React.Component {
  constructor(props) {
    // two props are token and genre
    super(props);

    this.state = {
      // is_paused is used to track the paused/play button
      is_paused: false,
      // is_active is used to check if we should render the normal UI, or a loading/empty screen
      is_active: false,
      // what is player used?
      player: undefined,
      // is_playing_left_track is created 
      // to help check if left/right song is playing,
      // in order to run a specific song.
      is_playing_left_track: true,
      // left and right side track are used to grab rendering information, such as album name and artist name.
      left_side_track: track,
      right_side_track: track,
      // previous_track is there to help with left_side/right_side track.
      previous_track: false,
      // when sending final playlist to spotify api to create a playlist, spotify receives an array of spotify uris
      final_playlist: [],
      made_move: false,
    }

    // handlePrevSong, handleNextSong are used for buttons in rendering and changing the current song that is played
    this.handlePrevSong = this.handlePrevSong.bind(this);
    this.handleNextSong = this.handleNextSong.bind(this);
    // handleChoice is used to add song to this.state.final_playlist
    this.handleChoice = this.handleChoice.bind(this);
    // submitPlaylist is used at the end of the app, to create a playlist and save to user's spotify account
    this.submitPlaylist = this.submitPlaylist.bind(this);
  }

  componentDidMount() {
    /*
      When the component is mounted on the DOM,
      The component will have this.props.genre and this.props.token as its disposal.
      The Component will use this.props.token to create an instance of the Web Playback SDK.
      The component will use this.props.genre to get songs for the app to play for the user.
      Create element script that will be our Web Playback SDK.

    */
    // fetch('/auth/seed/?' + new URLSearchParams({ genre: this.props.genre }));
    const { token } = this.props;

    const script = document.createElement("script");
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(token),
        volume: 0.3
      });

      this.setState({ player: spotifyPlayer });
      
      // When the device is online and ready
      // run a post request to transfer the user's playback state to our device.
      this.state.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        /*
        try {
          fetch('/auth/start/?' + new URLSearchParams({ device_id: device_id }));
        } catch(error) {
          console.log('ERROR: ', error);
        };
        */
        /*
        async function transferPlayback() {
          await fetch('/auth/playback/?' + new URLSearchParams({ device_id: device_id }));
        };
        transferPlayback();
        */

      });

      this.state.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.state.player.addListener('player_state_changed', ((state) => {
        if (!state) {
          return;
        }

        /*
        const {
          paused,
          track_window: { current_track, next_tracks, previous_tracks }
        } = state;

        previous_tracks.push(current_track);

        this.setState({
          left_side_track: this.state.is_playing_left_track ? current_track : previous_tracks[0],
          right_side_track: this.state.is_playing_left_track ? next_tracks[0] : current_track,
          is_paused: paused
        });
        
        this.state.player.getCurrentState().then( state => {
          (!state) ? this.setState({ is_active: false }) : this.setState({ is_active: true });
        });
        */
      }));
      this.state.player.connect();
    };
  };
  //When user clicks the previous button.
  // if they are listening to the left song, replay it.
    // use Spotify.Player#seek to  return to the first position of the song?
  // if they are listening to the right song, play the left song.
  handlePrevSong() {
    if (this.state.is_playing_left_track) {
      this.state.player.seek(0).then(() => {
        console.log('Replaying Song!');
      });
    } else {
      this.state.player.previousTrack();
      this.setState({ is_playing_left_track: !this.state.is_playing_left_track });
    }
  }

  //When user clicks the next button
  // If they are listening to the left song, play the right song.
  // set is_playing left_track to false
  // If they are listening to the right song.
  // Check to see if they choose a song yet.
  // If user hasn't chosen a song to add to the final playlist, alert that they must choose a song.
  // 
  handleNextSong() {
    if (this.state.is_playing_left_track) {
      this.state.player.nextTrack();
      this.setState({ is_playing_left_track: !this.state.is_playing_left_track });
    } else if (!this.state.made_move) {
      alert('You must choose a song!');
    } else {
      this.state.player.nextTrack();
      this.setState({ is_playing_left_track: !this.state.is_playing_left_track });
    }
  }

  handleChoice(side) {
    let updatedPlaylist = this.state.final_playlist;
    side === 'left-side' ? updatedPlaylist.push(this.state.left_side_track.uri) : updatedPlaylist.push(this.state.right_side_track.uri);

    this.setState({final_playlist: updatedPlaylist, made_move: true});
    console.log(this.state.final_playlist);
  }

  giveMeInfo() {
    fetch('/auth/seed/?' + new URLSearchParams({ genre: this.props.genre }));
  }

  submitPlaylist() {
    //post data to proxy, so proxy can make post request to insert songs into playlist
    async function postData(url = '', data = {}) {
      // grabs user id, then creates a playlist called Tinder music.
      await fetch('/api/playlist/create');
      // makes a post request, adding songs to playlist of Tinder music.
      return fetch(url, data);
    };

    postData('/auth/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'uris': this.state.final_playlist,
        'position': 0
      })
    });
  };

  render() {
    return (<div>hello</div>);
    /*
    if (!this.state.is_active) {
      return (
        <div>
          <b>Instance not active. Transfer your playback using your Spotify Connect.</b>
        </div>
      );
    } else {
      return (
        <main className="container">
          <div className="main-wrapper">
            <section className="player-display"  onClick={(e) => { this.handleChoice('left-side') }}>
              <img src={this.state.left_side_track.album.images[0].url} className="now-playing__cover" alt="" />
              <div className="now-playing__name">{this.state.left_side_track.name}</div>
              <div className="now-playing__artist">{this.state.left_side_track.artists[0].name}</div>
            </section>

            <section className="player-display" onClick={(e) =>  { this.handleChoice('right-side') }}>
              <img src={this.state.right_side_track.album.images[0].url} className="now-playing__cover" alt="" />
              <div className="now-playing__name">{this.state.right_side_track.name}</div>
              <div className="now-playing__artist">{this.state.right_side_track.artists[0].name}</div>
            </section>

            <section className="player-buttons">
              <button className="btn-spotify" onClick={this.handlePrevSong} >
                    Listen To Left Song
              </button>

              <button className="btn-spotify" onClick={() => { this.state.player.togglePlay() }} >
                { this.state.is_paused ? "PLAY" : "PAUSE" }
              </button>

              <button className="btn-spotify" onClick={this.submitPlaylist} >
                  FINISH
              </button>

              <button className="btn-spotify" onClick={this.handleNextSong} >
                  Listen To Right Song
              </button>

              <button className="btn-spotify" onClick={this.giveMeInfo} >
                Give me songs
              </button>
            </section>
          </div>
        </main>
      );
    };
    */
  };
};

export default WebPlayback;