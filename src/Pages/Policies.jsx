import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import './Pages.css';

const Policies = () => {
  return (
    <div className="Page">
      <Navbar />
      <div className="policy-background">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="background-blob">
          <path fill="#00808015" d="M45.3,-59.1C57.6,-49.5,65.9,-33.7,70.1,-16.6C74.3,0.5,74.4,19,67.4,34.1C60.4,49.2,46.3,61,30.4,66.9C14.6,72.8,-3,72.8,-19.9,67.7C-36.8,62.5,-52.9,52.3,-62.4,37.6C-71.9,22.9,-74.7,3.7,-70.8,-13.3C-66.9,-30.3,-56.3,-45.2,-42.5,-54.5C-28.7,-63.9,-11.7,-67.7,3.1,-71.8C17.9,-75.9,33,-68.7,45.3,-59.1Z" transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="background-blob-2">
          <path fill="#00808010" d="M38.5,-47.1C52.9,-36.5,69.5,-25.9,73.8,-11.5C78.1,2.9,70.1,21.2,58.9,35.7C47.7,50.2,33.2,60.9,17.8,63.9C2.3,66.9,-14.2,62.2,-27.2,53.9C-40.2,45.6,-49.7,33.7,-54.4,19.9C-59.1,6.1,-59,-9.7,-52.8,-22.5C-46.6,-35.3,-34.3,-45.2,-21.2,-56.3C-8.1,-67.4,5.8,-79.7,19.3,-77.5C32.8,-75.3,46,-57.7,38.5,-47.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="PolicyContainer">
        <div className="policy-header">
          <h1>Studio Policies</h1>
          <p className="policy-subtitle">Review our guidelines for a seamless experience</p>
        </div>

        <div className="PolicyContent">
          <section className="PolicySection">
            <h2>Booking & Payments</h2>
            <ul>
              <li>$100 deposit is required for appointments, applied to the final cost.</li>
              <li>We accept Cash, Card, PayPal, and Venmo.</li>
              <li>Cancellations or rescheduling must be done 24 hours in advance.</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Design & Age Requirements</h2>
            <ul>
              <li>All designs are custom and discussed during the session.</li>
              <li>We do not replicate existing designs or share them before appointments.</li>
              <li>Clients must be 18+; minors need a birth certificate and legal guardian present.</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Health & Safety</h2>
            <ul>
              <li>Inform us of any skin or health conditions before your appointment.</li>
              <li>Clients must not be under the influence of drugs or alcohol.</li>
              <li>Pets are not allowed in the shop.</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Behavior & Guests</h2>
            <ul>
              <li>Respectful behavior is mandatory; disruptive clients will be asked to leave.</li>
              <li>Clients may bring up to 2 guests for their appointment.</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Aftercare & Media</h2>
            <ul>
              <li>Detailed aftercare instructions are provided post-session.</li>
              <li>We reserve the right to photograph tattoos for portfolios and social media.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Policies;