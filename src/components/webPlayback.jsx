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
    super(props);

    this.state = {
      is_paused: false,
      is_active: false,
      player: undefined,
      is_playing_left_track: true,
      left_side_track: track,
      right_side_track: track,
      previous_track: false
    }

    this.handlePrevSong = this.handlePrevSong.bind(this);
    this.handleNextSong = this.handleNextSong.bind(this);
  }

  componentDidMount() {

    const script = document.createElement("script");
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(this.props.token),
        volume: 0.5
      });

      this.setState({ player: spotifyPlayer });
      
      // When the device is online and ready
      // run a post request to transfer the user's playback state to our device.
      this.state.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        fetch('/auth/playback/?' + new URLSearchParams({ device_id: device_id}));
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
          
              <section className="player-display">
                <img src={this.state.left_side_track.album.images[0].url} className="now-playing__cover" alt="" />
                <div className="now-playing__name">{this.state.left_side_track.name}</div>
                <div className="now-playing__artist">{this.state.left_side_track.artists[0].name}</div>
              </section>

              <section className="player-display">
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

                  <button className="btn-spotify" onClick={this.handleNextSong} >
                      Listen To Right Song
                  </button>
              </section>
            </div>
        </main>
      );
    };
  };
};

export default WebPlayback;