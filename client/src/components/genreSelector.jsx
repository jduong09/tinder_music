import React from 'react';
import axios from 'axios';

class GenreSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: '',
      genreList: [],
      input: ''
    };

    this.updateGenreList = this.updateGenreList.bind(this);
  }
  
  async componentDidMount() {
    try {
      const response = await axios('/api/genres').then((response) => response.data);
      const genreList = [];
      this.getRandomNums(response.genres).forEach(num => {
        genreList.push(response.genres[num]);
      });

      this.setState({ genres: response.genres, genreList: genreList });
    } catch(error) {
      console.log(error);
    }
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

  // needs to be called once, update the genre list after the fadeIn, fadeOut is complete.
  updateGenreList() {
    const randomNums = this.getRandomNums();
    const newGenreList = [];

    randomNums.forEach(num => {
      newGenreList.push(this.state.genres[num]);
    });

    this.setState({ genreList: newGenreList });
  };

  render() {
    const genreList = this.state.genreList.map((genre, i) => {
      return <li className="genre" key={i}><button className="yo" onClick={(e) => this.setState({input: e.currentTarget.innerHTML})} onAnimationIteration={this.updateGenreList}>{genre}</button></li>
    });

    if (this.state.genres) {
      const selectList = this.state.genres.map((genre, i) => {
        return <option value={genre} key={i}>{genre.toUpperCase()}</option>
      });

      return (
        <div className="select-list">
          <ul className="genres">{genreList}</ul>
          <span>OR</span>
          <select name='genres' id='genre-select' onChange={(e) => this.setState({input: e.target.value})}>
            <option value=''>--Please Choose A Genre--</option>
            {selectList}
          </select>

          <form onSubmit={this.props.handleGenreSelection}>
            <input name="genre" value={this.state.input} readOnly={true}/>
            <input type="submit" value="Select Genre" />            
          </form>
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
};

export default GenreSelector;