import React from 'react';
import Nav from './nav';
import headphonePicture from '../kaboompics-com-6251.jpg';

const LandingPage = () => (
  <section className="landing-page">
    <header className="app-header">
      <Nav />
    </header>
    <section>
      <section className="landing-page-about">
        <h2>Objective</h2>
        <ul>
          <li>Pick a genre you want to hear music from</li>
          <li>Choose the left song or the right song!</li>
          <li>Save YOUR songs to a playlist to listen later!</li>
        </ul>
        <a className="login-button" href="/auth/login">Get Started!</a>
      </section>
      <img id="headphone-stock" src={headphonePicture} alt="headphone-stock"/>
    </section>
  </section>
)

export default LandingPage;