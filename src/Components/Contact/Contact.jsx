import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  emailjs.init("5g8P1nv5NKMpKDxHq");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    emailjs.sendForm(
      'service_elyvlak',
      'template_6pmgboa',
      form.current,
      '5g8P1nv5NKMpKDxHq'
    )
    .then(() => {
      setSubmitted(true);
      setFormData({
        from_name: '',
        reply_to: '',
        phone: '',
        message: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    })
    .catch((error) => {
      setError('Failed to send message. Please try again.');
      console.error('Error:', error);
    });
  };

  return (
    <section className="ContactSection" id="contact">
      <div className="ContactContainer">
        <h2 className="ContactTitle">Contact Us</h2>
        
        <div className="ContactContent">
          <div className="MapSection">
            <div className="MapContainer">
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.4821549657546!2d-71.41463492439074!3d41.82018994444345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e445247a3d60c7%3A0x684bb28657c7c6c5!2s122%20Washington%20St%2C%20Providence%2C%20RI%2002903!5e0!3m2!1sen!2sus!4v1709168669317!5m2!1sen!2sus"
                className="Map"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="BusinessInfo">
              <div className="InfoItem">
                <h3>Location</h3>
                <p>122 Washington Street</p>
                <p>Providence, RI 02895</p>
              </div>
              
              <div className="InfoItem">
                <h3>Hours</h3>
                <p>Monday - Friday</p>
                <p>8:00 AM - 8:00 PM</p>
              </div>
            </div>
            {/*//! <div className="NewsLetterContainer">
                <h1>Sign up for our newsletter</h1>
                <input type="email"></input>
              </div> */}
          </div>

          <div className="FormSection">
            <form ref={form} onSubmit={handleSubmit} className="ContactForm">
              <div className="FormGroup">
                <label htmlFor="from_name">Name</label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="FormGroup">
                <label htmlFor="reply_to">Email</label>
                <input
                  type="email"
                  id="reply_to"
                  name="reply_to"
                  value={formData.reply_to}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="FormGroup">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* //! Add section for attatching files  */}

              <div className="FormGroup">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="SubmitButton">
                Send Message
              </button>

              {submitted && (
                <div className="SuccessMessage">
                  Message sent successfully!
                </div>
              )}
              
              {error && (
                <div className="ErrorMessage">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;