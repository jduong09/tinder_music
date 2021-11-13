import React from 'react';

const LandingPage = () => (

  // Prompt user for what kind of songs they are looking to listen to,
  // App will get song recommendations from spotify to play.
  // After user chooses this, have them login
  // Login takes user to web playback where they can play every song
  <section className="login">
    <a href="/auth/login">Login with Spotify Account</a>

    <a href='/auth/seed'>Find Random songs!</a>
  </section>
)

export default LandingPage;