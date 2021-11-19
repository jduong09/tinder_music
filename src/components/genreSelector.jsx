import React from 'react';

// Get available genre seeds from API for GenreSelector (done)
// There are around 126 genres.
// What to do with this info.
// Create 
class GenreSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: null,
      genreList: [],
      input: ''
    };

    this.changeButtonClass = this.changeButtonClass.bind(this);
    this.updateGenreList = this.updateGenreList.bind(this);
  }
  
  async componentDidMount() {
    const response = await fetch('/auth/genres');
    const json = await response.json();

    const genreList = [];

    this.getRandomNums(json.genres).forEach(num => {
      genreList.push(json.genres[num]);
    });

    this.setState({ genres: json.genres, genreList: genreList });
  };

  getRandomNums(genres = this.state.genres) {
    let randomNums = [];

    for (let i = 0; i < 5; i++) {
      const min = Math.floor(0);
      const max = Math.ceil(genres.length);
      const number = Math.floor(Math.random() * (max - min) + min);
      randomNums.push(number);
    };

    return randomNums;
  };

  changeButtonClass(e) {
    const target = e.currentTarget;
    target.classList.remove("yo");
    target.classList.add("hello");
  };

  // needs to be called once, update the genre list after the fadeIn, fadeOut is complete.
  updateGenreList() {
    const randomNums = this.getRandomNums();

    const newGenreList = [];

    randomNums.forEach(num => {
      newGenreList.push(this.state.genres[num]);
    });

    this.setState({ genreList: newGenreList });
    // add 5 new random genre buttons to the dom.
    // get random numbers
    // iterate over the random numbers
    // remove button at that index in the genre list. 
    // create a new button, with the random num being the genre in the genres array.
    // add to the genre list.

    // give them the same properties so they can fadeIn, fadeOut. 
  }

  render() {
    const genreList = this.state.genreList.map((genre, i) => {
      return <li className="genre" key={i}><button className="yo" onClick={this.props.handleGenreSelection} onAnimationIteration={this.updateGenreList}>{genre}</button></li>
    })

    if (this.state.genres) {
      return (
        <div>
          <ul className="genres">{genreList}</ul>
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
};

export default GenreSelector;