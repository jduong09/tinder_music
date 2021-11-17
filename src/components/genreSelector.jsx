import React, { useEffect, useState } from 'react';

// Get available genre seeds from API for GenreSelector (done)
// There are around 126 genres.
// What to do with this info.
// Create 
function GenreSelector() {

  const [genres, setGenres] = useState([]);
  
  useEffect(() => {
    async function getGenres() {
      const response = await fetch('/auth/genres');
      const json = await response.json();
      setGenres(json.genres);
    }

    getGenres();
  }, []);
  let randomNums = [];

  for (let i = 0; i < 5; i++) {
    const min = Math.floor(0);
    const max = Math.ceil(genres.length);
    const number = Math.floor(Math.random() * (max - min) + min);
    randomNums.push(number);
    console.log(randomNums)
  };

  const genreList = randomNums.map((num, i) => {
    return <li className="genre" key={i}><button>{genres[num]}</button></li>
  });

  if (genres) {
    return <ul className="genres">{genreList}</ul>;
  } else {
    return <div>Loading</div>;
  }
};

export default GenreSelector;