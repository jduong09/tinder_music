import { useState, useEffect } from 'react';
import './css';
import LandingPage from './components/landingPage.jsx';
import Main from './components/main.jsx';

/*
* How will the app run
* - Landing Page
*   - Prompt User to login to their spotify account, giving the app rights to alter their playback, to create a playlist and insert songs into that playlist. 
* - After authorization
*   - Moved to main component
*   - Give genre choices for user to select from.
* - After Genre choice
*  - Uses spotify recommendations api to get songs in order to play.
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
    };

    getToken();
  }, [token]);

  return (
    <main className="App">
      { (token === '') ? <LandingPage /> : <Main token={token} /> }
    </main>
  );
}

export default App;
