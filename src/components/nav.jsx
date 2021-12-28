import React from 'react';

const Nav = ({ pfp, name }) => (
  <nav>
    <img className="spotify-logo" src="spotifyIconRgbBlack.png" alt="spotify black logo" />
    <h1>Tinder Music</h1>
    <ul className="user-information">
      <li><img className="user-pfp" src={pfp} alt="user-pfp"/></li>
      <li className="user-name">{name}</li>
    </ul>
  </nav>
);

export default Nav;