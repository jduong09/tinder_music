import React from 'react';
import axios from 'axios';

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
      final_playlist: [],
      gametracks: [],
      made_move: false,
      round: 0
    }

    this.playLeftSong = this.playLeftSong.bind(this);
    this.playRightSong = this.playRightSong.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.submitPlaylist = this.submitPlaylist.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    try {
      await axios('api/seed/?' + new URLSearchParams({ genre: this.props.genre }));
    } catch(error) {
      console.log('Error: ', error);
    }

    const { token } = this.props;

    const script = document.createElement("script");
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(token),
        volume: 0.5
      });

      this.setState({ player: spotifyPlayer });
      const { player } = this.state;
      
      player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        try {
          const tracksArray = await axios('/api/start/?' + new URLSearchParams({ device_id })).then((response) => {
            const data = response.data;
            const { tracks }  = data;
            return tracks;
          });
          await axios('/api/playback/?' + new URLSearchParams({ device_id }));
          this.setState({ gametracks: tracksArray });
        } catch(error) {
          console.log('Error: ', error);
        }
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', ((state) => {
        if (!state) {
          return;
        }

        const {
          paused,
          track_window: { current_track, next_tracks }
        } = state;

        const { right_side_track, left_side_track, gametracks, round, final_playlist } = this.state;

        let currentRound = round;

        if (current_track.uri === gametracks[2 + (round * 2)]) {
          currentRound += 1;
        }

        if (final_playlist.length !== currentRound && current_track.uri === gametracks[2 + (round * 2)]) {
          player.previousTrack();
          player.previousTrack();
        }

        if (current_track.uid === right_side_track.uid) {
          this.setState({
            left_side_track,
            right_side_track: current_track,
            is_paused: paused,
            is_playing_left_track: false
          });
        } else {
          this.setState({
            left_side_track: current_track,
            right_side_track: next_tracks[0],
            is_paused: paused,
            is_playing_left_track: true
          });
        }
        
        player.getCurrentState().then((state) => {
          (!state) ? this.setState({ is_active: false }) : this.setState({ is_active: true });
        });
      }));
      player.connect();
    };
  };

  playLeftSong() {
    const { is_playing_left_track, player } = this.state;
    if (is_playing_left_track) {
      player.seek(0).then(() => {
        console.log('Replaying Song!');
      });
    } else {
      player.previousTrack();
      this.setState({ is_playing_left_track: !is_playing_left_track });
    }
  }

  playRightSong() {
    const { is_playing_left_track, player, made_move } = this.state;
    if (is_playing_left_track && !made_move) {
      player.nextTrack();
      this.setState({ is_playing_left_track: false });
    } else if (!made_move) {
      player.seek(0).then(() => {
        console.log('Replaying Song!');
      });
      this.setState({ is_playing_left_track: !is_playing_left_track });
    }
  }

  handleChoice(side) {
    const { final_playlist, left_side_track, right_side_track, is_playing_left_track, player, round } = this.state;
    let updatedPlaylist = final_playlist;
    side === 'left-side' ? updatedPlaylist.push(left_side_track.uri) : updatedPlaylist.push(right_side_track.uri);

    if (is_playing_left_track) {
      player.nextTrack();
      player.nextTrack();
    } else {
      player.nextTrack();
    }

    // If this is the 5th round, it would be the last 2 songs, and this choice would create the playlist and submit it.
    if (round === 4) {
      this.setState({ final_playlist: updatedPlaylist });
      this.submitPlaylist();
      return;
    }

    this.setState({final_playlist: updatedPlaylist, is_playing_left_track: true, round: round + 1 });
  }

  async submitPlaylist() {
    const { final_playlist } = this.state;
    try {
      await axios('/api/playlist/create');
      await axios({
        method: 'PUT',
        url: '/api/playlist/submit',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          uris: final_playlist,
          position: 0
        })
      });
    } catch(error) {
      console.log('Error: ', error);
    }
  }

  async handleLogout() {
    const { setToken } = this.props;
    const { player } = this.state;
    player.disconnect();
    try {
      await axios('/auth/logout');
    } catch(error) {
      console.log('Error: ', error);
    }

    setToken('');
  }

  render() {
    const { is_active, left_side_track, right_side_track, player, is_paused } = this.state;
    if (!is_active) {
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
              <img src={left_side_track.album.images[0].url} className="now-playing__cover" alt="" />
              <div className="now-playing__name">{left_side_track.name}</div>
              <div className="now-playing__artist">{left_side_track.artists[0].name}</div>
            </section>

            <section className="player-display" onClick={(e) =>  { this.handleChoice('right-side') }}>
              <img src={right_side_track.album.images[0].url} className="now-playing__cover" alt="" />
              <div className="now-playing__name">{right_side_track.name}</div>
              <div className="now-playing__artist">{right_side_track.artists[0].name}</div>
            </section>

            <section className="player-buttons">
              <button type="button" className="btn-spotify" onClick={this.playLeftSong} >
                    Listen To Left Song
              </button>

              <button type="button" className="btn-spotify" onClick={() => player.togglePlay()} >
                { is_paused ? "PLAY" : "PAUSE" }
              </button>

              <button type="button" className="btn-spotify" onClick={this.submitPlaylist} >
                  FINISH
              </button>

              <button type="button" className="btn-spotify" onClick={this.playRightSong} >
                  Listen To Right Song
              </button>
            </section>
          </div>
          <button type="button" className="btn-spotify" onClick={this.handleLogout}>Log Out</button>
        </main>
      );
    };
  };
};

export default WebPlayback;