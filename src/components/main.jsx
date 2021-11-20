import React from 'react';
import WebPlayback from './webPlayback';
import GenreSelector from './genreSelector';

/*
  - User needs to select the Genre they are looking to listen to
  - Load songs based on genre.
  - Transfer playback and user begins listening.
  - User chooses song they like, add to state playlist.
  - After 5 choices, present user with the final playlist.
  - User accepts, playlist is added to spotify. 
  - OR user resets game, and playlist is deleted, and go back to select genre.
*/

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: ''
    };

    
  }

  handleGenreSelection(e) {
    e.preventDefault();
    console.log(e.target[0].value);
    this.setState({genre: e.target[0].value});
  }

  render() {
    const { token } = this.props;

    return (
      <div>
        <GenreSelector handleGenreSelection={this.handleGenreSelection.bind(this)}/>
        <span>You selected {this.state.genre}</span>
        {/* <WebPlayback token={token} genre={this.state.genre} /> */}
      </div>
    );
  }
}

export default Main;