import React from 'react';
import logo from '../assets/heart_vector.png';

const Nav = ({ pfp, name }) => (
  <nav>
    <h1>Tinder Music <img id="logo" src={logo} alt="heart-vector" /></h1>
    { pfp
       && 
        <ul className="user-information">
          <li><img className="user-pfp" src={pfp} alt="user-pfp"/></li>
          <li className="user-name">{name}</li>
          <li><a href="/auth/logout">Log Out</a></li>
        </ul> 
    }
  </nav>
);

export default Nav;