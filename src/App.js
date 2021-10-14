import './css/App.css';
import WebPlayback from './components/webPlayback.jsx';
import Login from './components/auth/login.js';
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
        <h1>Tinder Music</h1>
      </header>
      { (token === '') ? <Login /> : <WebPlayback token={token} /> }
    </main>
  );
}

export default App;
