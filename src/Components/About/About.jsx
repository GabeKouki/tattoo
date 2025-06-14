import React from 'react';
import './About.css';

const About = () => {

  const scrollToArtists = () => {
    const artistSection = document.getElementById('artists');
    if (artistSection) {
      artistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section id="about" className="AboutSection">
      <div className="AboutContainer">
        <h2 className="AboutTitle">About Our Studio</h2>
        
        <div className="AboutContent">
          <div className="AboutText">
            <div className="AboutCard">
              <h3>Our Story</h3>
              <p>
                Located in Woodland Park Colorado, our studio has been a cornerstone 
                of the tattoo community for over 15 years. We pride ourselves on creativity, 
                professionalism, and absolute dedication to safety and quality.
              </p>
            </div>
            
            <div className="AboutCard">
              <h3>Health & Safety</h3>
              <p>
                We maintain the highest standards of safety and sterilization. Our studio 
                exceeds all health department regulations, ensuring a clean and professional 
                environment for every client.
              </p>
            </div>
          </div>

          <div className="AboutHighlights">
            <div className="HighlightCard">
              <div className="HighlightIcon">★</div>
              <h4>Custom Designs</h4>
              <p>Unique artwork tailored to your vision</p>
            </div>

            <div className="HighlightCard">
              <div className="HighlightIcon">✧</div>
              <h4>Professional Studio</h4>
              <p>State-of-the-art equipment and facilities</p>
            </div>

            <div className="HighlightCard">
              <div className="HighlightIcon">❋</div>
              <h4>Expert Artists</h4>
              <p>Experienced in various styles and techniques</p>
            </div>

            <div className="HighlightCard">
              <div className="HighlightIcon">✦</div>
              <h4>Safe Environment</h4>
              <p>Licensed, insured, and health-certified</p>
            </div>
          </div>
        </div>

        <div className="AboutCTA">
          <button className="CTAButton Secondary" onClick={scrollToArtists}>View Our Artists</button>
        </div>
      </div>
    </section>
  );
};

export default About;