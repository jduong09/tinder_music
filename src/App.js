import logo from './logo.svg';
import './App.css';

function App() {
  const client_id = 'CLIENT_ID';
  const client_secret = 'CLIENT_SECRET';
  const redirect_uri = 'REDIRECT_URI'; 
  const getSongFromApi = fetch('http');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello there are changes. Test.
        </a>
      </header>
    </div>
  );
}

export default App;
