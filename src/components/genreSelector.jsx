import React, { useEffect, useState } from 'react';

// Get available genre seeds from API for GenreSelector
function GenreSelector() {

  const [genres, setGenres] = useState('');
  
  useEffect(() => {
    async function getGenres() {
      const response = await fetch('/auth/genres');
      const json = await response.json();
      setGenres(json.genres);
    }

    getGenres();
  }, [])

  const genreList = genres.map((genre, idx) => {
    return <li key={idx}>{genre}</li>
  });
  
  if (genres) {
    return <ul>{genreList}</ul>
  } else {
    return <div>Loading</div>
  }
};

export default GenreSelector;