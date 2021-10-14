import React from 'react';

const track = {
  name: "",
  album: {
    images: [
      { url: "" }
    ]
  },
  artists: [
    { name: "" }
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
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(this.props.token),
        volume: 0.5
      });

      this.setState({ player: player });
      
      this.state.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      this.state.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.state.player.addListener('player_state_changed', ( state => {
        if (!state) {
          return;
        }

        if (this.state.is_playing_left_track) {
          this.setState({ left_side_track: state.track_window.current_track, right_side_track: state.track_window.next_tracks[0], is_paused: state.paused });
        } else {
          this.setState({ left_side_track: state.track_window.previous_tracks[1], right_side_track: state.track_window.current_track, is_paused: state.paused });
        }

        this.state.player.getCurrentState().then( state => {
          (!state) ? this.setState({ is_active: false }) : this.setState({ is_active: true });
        });
      }));

      this.state.player.connect();
    };
  };
  
  handlePrevSong() {
    if (!this.state.is_playing_left_track) {
      this.state.player.previousTrack();
      this.setState({ is_playing_left_track: true });
    } else {
      this.state.player.previousTrack();
      this.setState({ is_playing_left_track: false });
    }
  }

  handleNextSong() {
    if (this.state.is_playing_left_track) {
      this.state.player.nextTrack();
      this.setState({ is_playing_left_track: false });
    } else {
      this.state.player.nextTrack();
      this.setState({ is_playing_left_track: true });
    }
  }

  render() {
    if (!this.state.is_active) {
      return (
        <div>
          <b>Instance not active. Transfer your playback using your Spotify Connect.</b>
        </div>
      )
    } else {
      /*
      When user first sees webpage:
        Show user two songs. When user hits play. Play the one on the left.
        User can choose to play next one, and also go back to the previous one.
        User chooses which song they like more
        Show user two brand new songs.
      
      Code:
        Need a current_track (song currently playing).
        Need next_track (song on the right).
        need prev_track (for when user is listening to song on the right, they can choose to go back to the previous song.)
        Need button to play song.
        Need button to choose next and go back a song.
        Need button to for user to choose a song they like. Would go into a playlist to show at the end!
      */
      return (
        <main className="container">
            <div className="main-wrapper">
          
              <section className="left-side_player">
                <img src={this.state.left_side_track.album.images[0].url} className="now-playing__cover" alt="" />
                <div className="now-playing__name">{this.state.left_side_track.name}</div>
                <div className="now-playing__artist">{this.state.left_side_track.artists[0].name}</div>
              </section>

              <section className="right-side_player">
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