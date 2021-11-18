import React, { useEffect, useState } from 'react';

// Get available genre seeds from API for GenreSelector (done)
// There are around 126 genres.
// What to do with this info.
// Create 
class GenreSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: []
    };

    this.changeButtonClass = this.changeButtonClass.bind(this);
  }
  
  async componentDidMount() {
    const response = await fetch('/auth/genres');
    const json = await response.json();
    this.setState({ genres: json.genres });
  };

  getRandomNums() {
    const { genres } = this.state;
    console.log(genres);
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
    console.log(e.currentTarget);
    const target = e.currentTarget;
    target.classList.remove("yo");
    target.classList.add("hello");
  }

  render() {
    const genreList = this.getRandomNums().map((num, i) => {
      return <li className="genre" key={i}><button className="yo" onAnimationEnd={this.changeButtonClass}>{this.state.genres[num]}</button></li>
    });

    if (this.state.genres) {
      return <ul className="genres">{genreList}</ul>;
    } else {
      return <div>Loading</div>;
    }
  }
};

export default GenreSelector;