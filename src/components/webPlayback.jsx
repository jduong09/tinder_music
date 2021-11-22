import React from 'react';

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
    // two props are this.props.token and this.props.genre
    super(props);

    this.state = {
      is_paused: false,
      is_active: false,
      player: undefined,
      is_playing_left_track: true,
      left_side_track: track,
      right_side_track: track,
      previous_track: false,
      // when sending final playlist to spotify api to create a playlist, spotify receives an array of spotify uris
      final_playlist: []
    }

    this.handlePrevSong = this.handlePrevSong.bind(this);
    this.handleNextSong = this.handleNextSong.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.submitPlaylist = this.submitPlaylist.bind(this);
    this.giveMeInfo = this.giveMeInfo.bind(this);
  }

  componentDidMount() {
    fetch('/auth/seed/?' + new URLSearchParams({ genre: this.props.genre }));

    const script = document.createElement("script");
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(this.props.token),
        volume: 0.3
      });

      this.setState({ player: spotifyPlayer });
      
      // When the device is online and ready
      // run a post request to transfer the user's playback state to our device.
      this.state.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        async function transferPlayback() {
          await fetch('/auth/playback/?' + new URLSearchParams({ device_id: device_id }));
          return await fetch('/auth/start/?' + new URLSearchParams({device_id : device_id}));
        };
        transferPlayback();
      });

      this.state.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.state.player.addListener('player_state_changed', ( state => {
        if (!state) {
          return;
        }

        const {
          paused,
          track_window: { current_track, next_tracks, previous_tracks }
        } = state;

        console.log(current_track);
        console.log(next_tracks);

        this.setState({
          left_side_track: this.state.is_playing_left_track ? current_track : previous_tracks[1],
          right_side_track: this.state.is_playing_left_track ? next_tracks[0] : current_track,
          is_paused: paused
        });
        
        this.state.player.getCurrentState().then( state => {
          (!state) ? this.setState({ is_active: false }) : this.setState({ is_active: true });
        });
      }));
      this.state.player.connect();
    };
  };
  
  handlePrevSong() {
    this.state.player.previousTrack();
    this.setState({ is_playing_left_track: !this.state.is_playing_left_track });
  }

  handleNextSong() {
    this.state.player.nextTrack();
    this.setState({ is_playing_left_track: !this.state.is_playing_left_track });
  }

  handleChoice(side) {
    let updatedPlaylist = this.state.final_playlist;
    side === 'left-side' ? updatedPlaylist.push(this.state.left_side_track.uri) : updatedPlaylist.push(this.state.right_side_track.uri);

    this.setState({final_playlist: updatedPlaylist});
    console.log(this.state.final_playlist);
  }

  giveMeInfo() {
    fetch('/auth/seed/?' + new URLSearchParams({ genre: this.props.genre }));
  }

  submitPlaylist() {
    //post data to proxy, so proxy can make post request to insert songs into playlist
    async function postData(url = '', data = {}) {
      await fetch('/auth/user');
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
  };
};

export default WebPlayback;