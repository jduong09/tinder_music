import React from 'react';
import axios from 'axios';
import WebPlayback from './webPlayback';
import GenreSelector from './genreSelector';
import Nav from './nav';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: '',
      pfp: '', 
      name: '',
    }; 
  }

  async componentDidMount() {
    await axios('/auth/user')
    .then(response => {
      const { data } = response;
      this.setState({ pfp: data.pfp, name: data.displayName })
    });
  };

  handleGenreSelection(e) {
    e.preventDefault();
    this.setState({genre: e.target[0].value});
  }

  render() {
    const { token, setToken } = this.props;
    const { pfp, name, genre } = this.state;
    return (
      <div>
        <header className="app-header">
          <Nav pfp={pfp} name={name} />
        </header>
        {genre ? <WebPlayback token={token} genre={genre} setToken={setToken} /> : <GenreSelector handleGenreSelection={this.handleGenreSelection.bind(this)}/>}
      </div>
    );
  }
}

export default Main;