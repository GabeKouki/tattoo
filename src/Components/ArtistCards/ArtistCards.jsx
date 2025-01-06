import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import './ArtistCards.css';
import AudreyJenkins from '../../Images/Audrey.jpeg';
import ShilohHix from '../../Images/Shiloh.jpg';
import Christina from '../../Images/Christina.jpg';

const artists = [
  {
    id: 1,
    name: "Audrey Jenkins",
    specialty: "Black & Grey Realism",
    image: AudreyJenkins,
    email: "jane@studio.com",
    experience: "8 years",
    availability: "Mon-Fri",
    slug: "Audrey",
    socials: {
      instagram: "jane_tattoos",
      twitter: "jane_ink",
      facebook: "janesmith.tattoo"
    }
  },
  {
    id: 2,
    name: "Christina",
    specialty: "Color",
    image: Christina,
    email: "christina@studio.com",
    experience: "12 years",
    availability: "Tue-Sat",
    slug: "Christina",
    socials: {
      instagram: "christina_tattoos",
      facebook: "christinasmith.tattoo"
      
  },
  },
  {
    id: 3,
    name: "Shiloh Hix",
    specialty: "Realism",
    image: ShilohHix,
    email: "shiloh@studio.com",
    experience: "10 years",
    availability: "Mon-Fri",
    slug: "Shiloh",
    socials: {
      instagram: "shiloh_tattoos",
      twitter: "shiloh_ink",
      facebook: "shilohsmith.tattoo"
    }
  }
];

const ArtistCard = ({ artist }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="artist-card-container">
      <div className="artist-card" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`artist-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="artist-card-face artist-card-front">
            <div className="artist-image">
              <img src={artist.image} alt={artist.name} />
            </div>
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p className="specialty">{artist.specialty}</p>
              <p className="experience">{artist.experience}</p>
            </div>
            <div className="card-footer">
              <span className="flip-hint">Click for contact info</span>
            </div>
          </div>

          <div className="artist-card-face artist-card-back">
            <div className="contact-section">
              <h4>Contact Info</h4>
              <p className="email">{artist.email}</p>
              <p className="hours">Available: {artist.availability}</p>

              <div className="social-links">
                {artist.socials.instagram && (
                  <a href={`https://instagram.com/${artist.socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                )}
                {artist.socials.twitter && (
                  <a href={`https://twitter.com/${artist.socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                )}
                {artist.socials.facebook && (
                  <a href={`https://facebook.com/${artist.socials.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                )}
              </div>

              <Link to={`/artists/${artist.slug}`} className="portfolio-link">
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
  return (
    <section className="artists-section" id="artists">
      <div className="section-header">
        <h2>Our Artists</h2>
        <p>Meet our talented team of professional artists</p>
      </div>
      <div className="artists-grid">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default ArtistCards;