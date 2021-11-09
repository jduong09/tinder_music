import './css/reset.css';
import './css/App.css';
import WebPlayback from './components/webPlayback.jsx';
import LandingPage from './components/landingPage.js';
import { useState, useEffect } from 'react';

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
      { (token === '') ? <LandingPage /> : <WebPlayback token={token} /> }
    </main>
  );
}

export default App;
