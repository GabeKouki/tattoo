import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as FacebookIcon } from "../../Images/FacebookIcon.svg";
import { ReactComponent as TwitterIcon } from "../../Images/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../../Images/InstagramIcon.svg";
import "./ArtistCards.css";
import { fetchAllArtists } from "../../Utils/dashboardUtils";

const ArtistCard = ({ artist }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="artist-card-container">
      <div className="artist-card" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`artist-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Front of card */}
          <div className="artist-card-face artist-card-front">
            <div className="artist-image-wrapper">
              <img src={artist.profile_picture} alt={artist.name} className="artist-image" />
              <div className="artist-specialty-badge">{artist.specialty}</div>
            </div>
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <div className="artist-details">
                <span className="detail-item-card">
                  <i className="far fa-clock"></i> {artist.experience}
                </span>
              </div>
              <p className="artist-bio">
                Specializing in {artist.specialty} designs with a focus on creating unique, personalized artwork for each client.
              </p>
              <div className="artist-card-footer">
                <span className="flip-hint">Click to reverse</span>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="artist-card-face artist-card-back">
            <div className="contact-section">
              <h4>Contact</h4>
              <div className="contact-info-group">
                <p className="email">{artist.email}</p>
                <p className="hours">Available: {artist.availability}</p>
              </div>
              <h4>Socials</h4>
              <div className="social-links">
                {artist.instagram_link && (
                  <a href={artist.instagram_link} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="social-icon" />
                  </a>
                )}
                {artist.twitter_link && (
                  <a href={artist.twitter_link} target="_blank" rel="noopener noreferrer">
                    <TwitterIcon className="social-icon" />
                  </a>
                )}
                {artist.facebook_link && (
                  <a href={artist.facebook_link} target="_blank" rel="noopener noreferrer">
                    <FacebookIcon className="social-icon" />
                  </a>
                )}
              </div>
              <Link to={`/artists/${artist.id}`} className="portfolio-link">
                View Full Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistCards = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Determine cards per page based on window width
  const getCardsPerPage = () => {
    if (windowWidth > 1200) return 3;
    if (windowWidth > 768) return 2;
    return 1;
  };

  const cardsPerPage = getCardsPerPage();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchAllArtists();
      setArtists(data);
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(artists.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const visibleArtists = artists.slice(startIndex, startIndex + cardsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="artists-section" id="artists">
      <div className="section-header">
        <h2>Meet Our Artists</h2>
        <p className="section-description">
          Each artist at our studio brings their own unique style and expertise
          to every piece they create. From detailed black and grey work to
          vibrant color pieces, our team is dedicated to bringing your vision to
          life.
        </p>
      </div>
      <div className="expertise-badges">
        <div className="expertise-item">
          <span className="expertise-number">30+</span>
          <span className="expertise-label">Years Combined Experience</span>
        </div>
        <div className="expertise-item">
          <span className="expertise-number">3000+</span>
          <span className="expertise-label">Satisfied Clients</span>
        </div>
        <div className="expertise-item">
          <span className="expertise-number">100%</span>
          <span className="expertise-label">Custom Designs</span>
        </div>
      </div>

      <div className="artists-slider-container">
        {artists.length > cardsPerPage && (
          <button className="slider-arrow prev" onClick={prevPage}>
            &#8592;
          </button>
        )}
        
        <div className="artists-grid">
          {visibleArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {artists.length > cardsPerPage && (
          <button className="slider-arrow next" onClick={nextPage}>
            &#8594;
          </button>
        )}
      </div>

      <div className="ButtonContainer">
        <button className="CTAButton">
          <Link>View Full Gallery</Link>
        </button>
      </div>
    </section>
  );
};

export default ArtistCards;