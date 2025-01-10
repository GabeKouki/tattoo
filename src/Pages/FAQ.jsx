import React, { useEffect } from 'react';
import './Pages.css';

const FAQ = () => {
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

      <div className="FAQContainer">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p className="faq-subtitle">Everything you need to know about getting tattooed with us</p>
        </div>

        <div className="FAQContent">
          <section className="FAQSection">
            <h2>How do I book an appointment?</h2>
            <p>You can book an appointment through our website's contact form, by calling the studio, or by sending us an email. A $100 deposit is required to secure your appointment.</p>
          </section>

          <section className="FAQSection">
            <h2>How much do tattoos cost?</h2>
            <p>Tattoo pricing varies based on size, complexity, and time required. Our minimum charge is $100. We provide detailed quotes during consultations after reviewing your desired design and placement.</p>
          </section>

          <section className="FAQSection">
            <h2>What forms of payment do you accept?</h2>
            <p>We accept cash, all major credit cards, PayPal, and Venmo. The deposit must be paid to secure your appointment, and the remaining balance is due at the end of your session.</p>
          </section>

          <section className="FAQSection">
            <h2>Do I need to be 18?</h2>
            <p>Yes, you must be 18 or older to get tattooed. We require a valid government-issued photo ID for verification.</p>
          </section>

          <section className="FAQSection">
            <h2>How should I prepare for my tattoo?</h2>
            <ul>
              <li>Get a good night's sleep</li>
              <li>Eat a proper meal beforehand</li>
              <li>Stay hydrated</li>
              <li>Avoid alcohol for 24 hours before your appointment</li>
              <li>Wear comfortable, appropriate clothing</li>
            </ul>
          </section>

          <section className="FAQSection">
            <h2>What about touch-ups?</h2>
            <p>We offer free touch-ups within the first 3 months if needed, provided you've followed all aftercare instructions properly.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQ;