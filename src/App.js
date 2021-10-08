import logo from './logo.svg';
import './App.css';

function App() {
  const client_id = 'CLIENT_ID';
  const client_secret = 'CLIENT_SECRET';
  const baseencodedClientCredentials = btoa(`${client_id}:${client_secret}`);
  const url = 'https://accounts.spotify.com/api/token';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Basic ${baseencodedClientCredentials}`);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  
  const authorizeUser = () => { 
    let access_token = fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: 'grant_type=client_credentials'
    })
      .then(data => data.json())
      .then(res => res.access_token);
  };

  console.log(authorizeUser());

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
