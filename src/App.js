import './css/reset.css';
import './css/App.css';
import WebPlayback from './components/webPlayback.jsx';
import LandingPage from './components/landingPage.js';
import Main from './components/main.jsx';
import { useState, useEffect } from 'react';

// Here is the homepage. ('/')

/*
* How will the app run
* - Landing Page
*   - Prompt User to login to their spotify account, giving the app rights to alter their playback, to create a playlist and insert songs into that playlist. 
*   - Uses spotify recommendations api to get songs in order to play.
* - After authorization
*   - Moved to main component
*   - Give genre choices for user to select from.
* - After Genre choice
*   - transfer playback
      - play songs and after 5 rounds, create playlist for user
      - Give final playlist. 
*/ 
function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return (
    <main className="App">
      <header>
        <nav>
          <img src="spotifyIconRgbBlack.png" alt="spotify black logo"/>
          <h1>Tinder Music</h1>
          { (token === '') ? <ul></ul> : <ul><li>Hello Spotify is connected</li></ul> }
        </nav>
      </header>
      { (token === '') ? <LandingPage /> : <Main token={token} /> }
    </main>
  );
}

export default App;
