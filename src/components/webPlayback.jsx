import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

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

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [prev_track, setPrevTrack] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [next_track, setNextTrack] = useState(track);
  };

  useEffect() { () => {
    const script = document.createElement("script");
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(token),
        volume: 0.5
      });

      setPlayer(player);
      
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', ( state => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setNextTrack(state.track_window.next_tracks[0]);

        setPaused(state.paused);

        player.getCurrentState().then( state => {
          (!state) ? setActive(false) : setActive(true);
        });
      }));

      player.connect();
    };
  }, [token])
  };


  render() {
    if (!is_active) {
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
                <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
                <div className="now-playing__name">{prev_track ? prev_track.name : current_track.name}</div>
                <div className="now-playing__artist">{prev_track ? "hello" : current_track.artists[0].name}</div>

                <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                    &lt;&lt;
                </button>

                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                  { is_paused ? "PLAY" : "PAUSE" }
                </button>

                <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                    &gt;&gt;
                </button>
              </section>

              <section className="right-side_player">
                <img src={next_track.album.images[0].url} className="now-playing__cover" alt="" />
                <div className="now-playing__name">{prev_track ? current_track.name : next_track.name}</div>
                <div className="now-playing__artist">{prev_track? current_track.artists[0].name : next_track.artists[0].name}</div>

                <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                    &lt;&lt;
                </button>

                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                  { is_paused ? "PLAY" : "PAUSE" }
                </button>

                <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                    &gt;&gt;
                </button>
              </section>
            </div>
        </main>
      );
    };
  };
};

export default WebPlayback;