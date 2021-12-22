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

/*
 * Select Genre: Make a modal?
*/

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: '',
      name: '',
      pfp: '',
    };

    
  }

  componentDidMount() {
    fetch('/auth/user').then(data => data.json()).then(user => this.setState({ pfp: user.pfp, name: user.displayName }));
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
        <header>
          <ul class="user-information">
            <li>{this.state.name}</li>
            <li><img className="user-pfp" src={this.state.pfp} alt="user-pfp"/></li>
          </ul>
        </header>
        <GenreSelector handleGenreSelection={this.handleGenreSelection.bind(this)}/>
        {this.state.genre ? <WebPlayback token={token} genre={this.state.genre ? this.state.genre : ''} /> : ''}
      </div>
    );
  }
}

export default Main;