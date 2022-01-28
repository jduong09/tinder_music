import React from 'react';
import axios from 'axios';
import WebPlayback from './webPlayback';
import GenreSelector from './genreSelector';
import Nav from './nav';

/*
  - User needs to select the Genre they are looking to listen to
  - Load songs based on genre.
  - Transfer playback and user begins listening.
  - User chooses song they like, add to state playlist.
  - After 5 choices, present user with the final playlist.
  - User accepts, playlist is added to spotify. 
  - OR user resets game, and playlist is deleted, and go back to select genre.
*/

/*
 * Select Genre: Make a modal?
*/

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
    const { token } = this.props;
    const { pfp, name, genre } = this.state;
    return (
      <div>
        <header className="app-header">
          <Nav pfp={pfp} name={name} />
        </header>
        <GenreSelector handleGenreSelection={this.handleGenreSelection.bind(this)}/>
        {genre ? <WebPlayback token={token} genre={genre} /> : ''}
      </div>
    )
  }
}

export default Main;