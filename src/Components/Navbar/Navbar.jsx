import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { ReactComponent as Logo } from '../../Images/TestLogo.svg';
import { ReactComponent as TwitterIcon } from '../../Images/TwitterIcon.svg';
import { ReactComponent as InstagramIcon } from '../../Images/InstagramIcon.svg';
import { ReactComponent as FacebookIcon } from '../../Images/FacebookIcon.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      //! If we're not on the home page, navigate to home first
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      //! If we're already on the home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  //! Handle scroll after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      //!Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav>
      <div className="NavbarContainer">
        <div className="LogoContainer">
          <Link to="/" className="LogoLink">
          {/* //TODO: replace with real logo */}
            <Logo className="NavbarLogo" onClick={() => scrollToSection('home')} />
            {/* <h1 className='NavText'>Above The Clouds</h1> */}
          </Link>
        </div>
        <div className="NavLinksContainer">
          <ul className="NavLinks">
            {/* Home page sections */}
            <li><button onClick={() => scrollToSection('about')} className="NavLink">About</button></li>
            <li className="NavDropdown">
              <button onClick={() => scrollToSection('artists')} className="NavLink">Artists ▾</button>
              <ul className="DropdownContent">
                <li><Link to="/artists/Audrey" className="DropdownLink">Audrey</Link></li>
                <li><Link to="/artists/Shiloh" className="DropdownLink">Shiloh</Link></li>
                <li><Link to="/artists/Christina" className="DropdownLink">Christina</Link></li>
              </ul>
            </li>
            <li><button onClick={() => scrollToSection('gallery')} className="NavLink">Gallery</button></li>
            

            {/* Separate pages */}
            <li><Link to="/booking" className="NavLink">Book Now</Link></li>
            
            {/* Info Dropdown */}
            <li className="NavDropdown">
              <span className="NavLink">Info ▾</span>
              <ul className="DropdownContent">
                <li><Link to="/aftercare" className="DropdownLink">Aftercare</Link></li>
                <li><Link to="/faq" className="DropdownLink">FAQ</Link></li>
                <li><Link to="/policies" className="DropdownLink">Policies</Link></li>
              </ul>
            </li>

            <li><button onClick={() => scrollToSection('contact')} className="NavLink">Contact</button></li>
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
            aria-label="Toggle navigation menu"
          >
            <span className="HamburgerBar"></span>
            <span className="HamburgerBar"></span>
            <span className="HamburgerBar"></span>
          </button>
        </div>
      </div>
      <div className={`MobileMenu ${isOpen ? 'Show' : ''}`}>
        <ul className="MobileLinks">
          <li><button onClick={() => scrollToSection('about')} className="MobileLink">About</button></li>
          <li><button onClick={() => scrollToSection('artists')} className="MobileLink">Artists</button></li>
          <li><button onClick={() => scrollToSection('gallery')} className="MobileLink">Gallery</button></li>
          <li><Link to="/booking" className="MobileLink" onClick={closeNavbar}>Book Now</Link></li>
          <li><Link to="/aftercare" className="MobileLink" onClick={closeNavbar}>Aftercare</Link></li>
          <li><Link to="/faq" className="MobileLink" onClick={closeNavbar}>FAQ</Link></li>
          <li><button onClick={() => scrollToSection('contact')} className="MobileLink">Contact</button></li>
        </ul>
        <div className="MobileSocials">
          <ul className="MobileSocialLinks">
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer noopener"><TwitterIcon className="SocialIcon" /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener"><InstagramIcon className="SocialIcon" /></a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer noopener"><FacebookIcon className="SocialIcon" /></a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;