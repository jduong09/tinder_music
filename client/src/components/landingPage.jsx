import React from 'react';
import Nav from './nav';

const LandingPage = () => (
  /** How do I want the landing page to look.
   * Displays App Title, Spotify logo.
   * Displays Login Button/Get Started Button.
  /*
  
  */
  <section className="landing-page">
    <header className="app-header">
      <Nav />
    </header>
    <section className="landing-page-about">
      <h2>Objective</h2>
      <ul>
        <li>Pick a genre you want to hear music from</li>
        <li>Choose the left song or the right song!</li>
        <li>Save YOUR songs to a playlist to listen later!</li>
      </ul>
      <a className="login-button" href="/auth/login">Get Started!</a>
    </section>
  </section>
)

export default LandingPage;