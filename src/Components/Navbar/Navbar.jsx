import React, { useState } from 'react';
import './Navbar.css';
import { ReactComponent as Logo } from '../../Images/TestLogo.svg';
import { ReactComponent as TwitterIcon } from '../../Images/TwitterIcon.svg';
import { ReactComponent as InstagramIcon } from '../../Images/InstagramIcon.svg';
import { ReactComponent as FacebookIcon } from '../../Images/FacebookIcon.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="NavbarContainer">
        <div className="LogoContainer">
          <Logo className="NavbarLogo" />
        </div>
        <div className="NavLinksContainer">
          <ul className="NavLinks">
            <li><a href="#home" className="NavLink">About</a></li>
            <li><a href="#portfolio" className="NavLink">Portfolio</a></li>
            <li><a href="#team" className="NavLink">Team</a></li>
            <li><a href="#contact" className="NavLink">Contact</a></li>
            <li><a href="#appointments" className="NavLink">Appointments</a></li>
          </ul>
        </div>
        <div className="SocialLinksContainer">
          <ul className="SocialLinks">
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer noopener"><TwitterIcon className="SocialIcon" /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener"><InstagramIcon className="SocialIcon" /></a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer noopener"><FacebookIcon className="SocialIcon" /></a></li>
          </ul>
          <button
            className={`HamburgerButton ${isOpen ? 'Open' : ''}`}
            onClick={toggleNavbar}
            type="button"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="HamburgerBar" />
            <span className="HamburgerBar" />
            <span className="HamburgerBar" />
          </button>
        </div>
      </div>
      <div className={`DropDownContainer ${isOpen ? 'Show' : ''}`}>
        <div className="DropDownLinksContainer">
          <ul className="DropDownLinks">
            {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
            <li><a href="#home" className="DropDownLink" onClick={closeNavbar}>About</a></li>
            <li><a href="#portfolio" className="DropDownLink" onClick={closeNavbar}>Portfolio</a></li>
            <li><a href="#team" className="DropDownLink" onClick={closeNavbar}>Team</a></li>
            <li><a href="#contact" className="DropDownLink" onClick={closeNavbar}>Contact</a></li>
            <li><a href="#appointments" className="DropDownLink" onClick={closeNavbar}>Appointments</a></li>
          </ul>
        </div>
        <div className="DropDownSocials">
          <ul className="DropDownSocial">
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer noopener"><TwitterIcon className="SocialIcon" /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener"><InstagramIcon className="SocialIcon" /></a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer noopener"><FacebookIcon className="SocialIcon" /></a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
