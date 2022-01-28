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
          await axios('/api/start/?' + new URLSearchParams({ device_id }));
          await axios('/api/playback/?' + new URLSearchParams({ device_id }));
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
          track_window: { current_track, next_tracks, previous_tracks }
        } = state;

        const { is_playing_left_track } = this.state;

        previous_tracks.push(current_track);

        this.setState({
          left_side_track: is_playing_left_track ? current_track : previous_tracks[0],
          right_side_track: is_playing_left_track ? next_tracks[0] : current_track,
          is_paused: paused
        });
        
        player.getCurrentState().then((state) => {
          (!state) ? this.setState({ is_active: false }) : this.setState({ is_active: true });
        });
      }));
      player.connect();
    };
  };

  handlePrevSong() {
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

  handleNextSong() {
    const { is_playing_left_track, player, made_move } = this.state;
    if (is_playing_left_track) {
      player.nextTrack();
      this.setState({ is_playing_left_track: !is_playing_left_track });
    } else if (!made_move) {
      alert('You must choose a song!');
    } else {
      player.nextTrack();
      this.setState({ is_playing_left_track: !is_playing_left_track });
    }
  }

  handleChoice(side) {
    const { final_playlist, left_side_track, right_side_track } = this.state;
    let updatedPlaylist = final_playlist;
    side === 'left-side' ? updatedPlaylist.push(left_side_track.uri) : updatedPlaylist.push(right_side_track.uri);

    this.setState({final_playlist: updatedPlaylist, made_move: true});
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
  };

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
              <button className="btn-spotify" onClick={this.handlePrevSong} >
                    Listen To Left Song
              </button>

              <button className="btn-spotify" onClick={() => player.togglePlay()} >
                { is_paused ? "PLAY" : "PAUSE" }
              </button>

              <button className="btn-spotify" onClick={this.submitPlaylist} >
                  FINISH
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