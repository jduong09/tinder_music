import { useState, useEffect } from 'react';
import axios from 'axios';
import './css';
import LandingPage from './components/landingPage.jsx';
import Main from './components/main.jsx';

const App = () => {

  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const response = await axios('/auth/token');
      if (response.status === 400) {
        return;
      }

      setToken(response.data);
    };

    getToken();
  }, [token]);

  return (
    <main className="App">
      {(token === '') ? <LandingPage /> : <Main token={token} setToken={setToken} />}
    </main>
  );
}

export default App;
