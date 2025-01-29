import React, { useEffect } from 'react';
import './Pages.css';

const Aftercare = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Page">
      <div className="policy-background">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="background-blob">
          <path fill="#00808015" d="M45.3,-59.1C57.6,-49.5,65.9,-33.7,70.1,-16.6C74.3,0.5,74.4,19,67.4,34.1C60.4,49.2,46.3,61,30.4,66.9C14.6,72.8,-3,72.8,-19.9,67.7C-36.8,62.5,-52.9,52.3,-62.4,37.6C-71.9,22.9,-74.7,3.7,-70.8,-13.3C-66.9,-30.3,-56.3,-45.2,-42.5,-54.5C-28.7,-63.9,-11.7,-67.7,3.1,-71.8C17.9,-75.9,33,-68.7,45.3,-59.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="AftercareContainer">
        <div className="aftercare-header">
          <h1>Tattoo Aftercare</h1>
          <p className="aftercare-subtitle">Follow these instructions carefully for optimal healing</p>
        </div>

        <div className="AftercareContent">
          <section className="AftercareSection">
            <h2>First 24 Hours</h2>
            <ul>
              <li>Leave the bandage on for 2-4 hours</li>
              <li>Wash hands thoroughly before touching the tattoo</li>
              <li>Gently wash the tattoo with lukewarm water and unscented antibacterial soap</li>
              <li>Pat dry with a clean paper towel</li>
              <li>Allow the tattoo to air dry for 10-15 minutes</li>
            </ul>
          </section>

          <section className="AftercareSection">
            <h2>Days 1-3</h2>
            <ul>
              <li>Wash the tattoo 2-3 times daily</li>
              <li>Apply a thin layer of recommended aftercare ointment</li>
              <li>Do not re-bandage</li>
              <li>Avoid direct sunlight</li>
              <li>Wear loose-fitting clothing</li>
            </ul>
          </section>

          <section className="AftercareSection">
            <h2>Days 4-14</h2>
            <ul>
              <li>Continue washing 1-2 times daily</li>
              <li>Switch to unscented lotion after day 3</li>
              <li>Don't pick or scratch at scabs</li>
              <li>Avoid swimming pools, hot tubs, and long baths</li>
            </ul>
          </section>

          <section className="AftercareSection">
            <h2>Long-Term Care</h2>
            <ul>
              <li>Always use high SPF sunscreen on exposed tattoos</li>
              <li>Keep the tattoo moisturized</li>
              <li>Avoid tanning beds</li>
            </ul>
          </section>

          <section className="AftercareSection">
            <h2>Warning Signs</h2>
            <p>Contact us or seek medical attention if you experience:</p>
            <ul>
              <li>Unusual redness or swelling</li>
              <li>Warm or hot skin around the tattoo</li>
              <li>Colored discharge</li>
              <li>Fever</li>
              <li>Excessive pain</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Aftercare;