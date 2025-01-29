import React, { useState } from 'react';
import './MainHero.css';
import inkGif from '../../Images/HeroVideo.mp4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
const MainHero = () => {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="MainHeroContainer">
      <div className="GifBackground">
        <video
          muted
          autoPlay
          playsInline
          loop
          src={inkGif}
          className="BackgroundGif"
          preload="auto"
        />
        <div className="GifOverlay"></div>
      </div>
      <div className="MainHeroContent">
        <h1 className="MainHeroTitle">Where Art Meets Elevation</h1>
        <div className="MainHeroInfo">
          <p>Woodland Park, CO</p>
          <p>Mon-Fri: 12PM-8PM</p>
        </div>
      </div>
      <div
        className="ScrollIndicator"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={scrollToAbout}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') scrollToAbout();
        }}
      >
        {isHovered ? (
          <span className="ScrollText">Scroll Down</span>
        ) : (
          <FontAwesomeIcon
            icon={faAnglesDown}
            className="ScrollArrow"
            beat
          />
        )}
      </div>
    </div>
  );
};

export default MainHero;