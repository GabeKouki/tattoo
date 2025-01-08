import React from 'react';
// import './Home.css'
import MainHero from '../Components/Hero/MainHero';
import ArtistCards from '../Components/ArtistCards/ArtistCards';
// import Portfolio from '../Components/Portfolio/Portfolio';
import About from '../Components/About/About';
import Testimonials from '../Components/Testimonials/Testimonials';
import Contact from '../Components/Contact/Contact';

const Home = () => {
  return (
    <div>
      <section id="home">
      <div className="Spacer" />
      </section>
      <MainHero />
      <About />
      <section id="about">
        <ArtistCards />
      </section>
      {/* <section id="gallery">
        <Portfolio />
      </section> */}
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default Home;