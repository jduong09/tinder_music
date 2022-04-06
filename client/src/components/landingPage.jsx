import React from 'react';
import Nav from './nav';
import heroImage from '../assets/heroImage.png';
import '../css/landingPage.css';

const LandingPage = () => (
  <section className="landing-page">
    <header className="app-header">
      <Nav />
    </header>
    <main>
      <div className="landingPageHeader" >
        <h2>Fall In Love With Music.</h2>
        <img id="heroImage" src={heroImage} alt="cat listening to music" />
      </div>
      <ul className="landingPageAbout" >
        <li><a className="login-button" href="/auth/login">Get Started!</a></li>
        <li>Select A Genre</li>
        <li>Choose Between Songs</li>
        <li>Keep It Forever</li>
      </ul>
    </main>
  </section>
)

export default LandingPage;