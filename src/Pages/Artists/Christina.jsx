import React, { useState } from 'react';
import './ArtistPage.css';

const Christina = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tattooDescription: '',
    size: '',
    placement: '',
    references: null,
    additionalInfo: ''
  });

  const categories = [
    'all',
    'black & grey',
    'color',
    'traditional',
    // Add more categories based on artist's work
  ];

  // Example work data structure
  const workExamples = [
    {
      id: 1,
      image: "path-to-image",
      category: "black & grey",
      description: "Description of the piece"
    },
    // Add more work examples
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="ArtistPage">
      {/* Artist Intro Section */}
      <section className="ArtistIntro">
        <div className="ArtistProfile">
          <img src="path-to-christina-profile" alt="Christina" className="ArtistImage" />
          <div className="ArtistInfo">
            <h1>Christina</h1>
            <p className="ArtistBio">
              Professional bio and introduction goes here...
            </p>
            <div className="ArtistSocials">
              <a href="instagram-link" target="_blank" rel="noopener noreferrer">@christina.tattoos</a>
              {/* Add other social links */}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="ArtistPortfolio">
        <h2>Portfolio</h2>
        <div className="CategoryFilter">
          {categories.map(category => (
            <button
              key={category}
              className={`FilterButton ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="WorkGrid">
          {workExamples
            .filter(work => selectedCategory === 'all' || work.category === selectedCategory)
            .map(work => (
              <div key={work.id} className="WorkItem">
                <img src={work.image} alt={work.description} />
              </div>
            ))}
        </div>
      </section>

      {/* Booking Inquiry Section */}
      <section className="BookingInquiry">
        <h2>Request an Appointment</h2>
        <button 
          className="InquiryButton"
          onClick={() => setShowForm(true)}
        >
          Start Booking Process
        </button>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="InquiryForm">
            <div className="FormGroup">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="tattooDescription">Tattoo Description *</label>
              <textarea
                id="tattooDescription"
                required
                value={formData.tattooDescription}
                onChange={(e) => setFormData({...formData, tattooDescription: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="size">Approximate Size *</label>
              <input
                type="text"
                id="size"
                required
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="placement">Placement on Body *</label>
              <input
                type="text"
                id="placement"
                required
                value={formData.placement}
                onChange={(e) => setFormData({...formData, placement: e.target.value})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="references">Reference Images</label>
              <input
                type="file"
                id="references"
                multiple
                accept="image/*"
                onChange={(e) => setFormData({...formData, references: e.target.files})}
              />
            </div>

            <div className="FormGroup">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              />
            </div>

            <button type="submit" className="SubmitButton">
              Submit Inquiry
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Christina;