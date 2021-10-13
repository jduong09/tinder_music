import './App.css';
import WebPlayback from './components/webPlayback.jsx';
import Login from './components/auth/login.js';
import { useState, useEffect } from 'react';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      console.log(json);
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return (
    <div className="App">
      { (token === '') ? <Login /> : <WebPlayback token={token} /> }
    </div>
  );
}

export default App;
