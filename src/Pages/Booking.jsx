import React, { useState } from 'react';
import './Booking.css';

const Booking = () => {
  const [formData, setFormData] = useState({
    artist: '',
    name: '',
    email: '',
    phone: '',
    tattooDescription: '',
    size: '',
    placement: '',
    references: null,
    additionalInfo: '',
  });

  const [fileInfo, setFileInfo] = useState('');
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'references' && files) {
      if (files.length > 3) {
        alert('Please select a maximum of 3 files');
        return;
      }
      setFormData({ ...formData, [id]: files });
      setFileInfo(`${files.length} image${files.length !== 1 ? 's' : ''} selected`);
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(xxx) xxx-xxxx"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Tattoo Details</h2>
            <div className="form-group">
              <label htmlFor="artist">Select Artist</label>
              <select id="artist" required value={formData.artist} onChange={handleChange}>
                <option value="">Choose an artist...</option>
                <option value="Audrey Jenkins">Audrey Jenkins</option>
                <option value="Christina Moore">Christina Moore</option>
                <option value="Shiloh Barrett">Shiloh Barrett</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tattooDescription">Tattoo Description</label>
              <textarea
                id="tattooDescription"
                placeholder="Describe your tattoo idea in detail"
                required
                value={formData.tattooDescription}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="size">Size (inches)</label>
                <input
                  type="text"
                  id="size"
                  placeholder="e.g., 5x7"
                  required
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="placement">Placement</label>
                <input
                  type="text"
                  id="placement"
                  placeholder="e.g., Left forearm"
                  required
                  value={formData.placement}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label htmlFor="references">Reference Images</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="references"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  max="3"
                />
                <p className="file-info">
                  {fileInfo || 'Drop up to 3 reference images here'}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Notes</label>
              <textarea
                id="additionalInfo"
                placeholder="Any other details or special requests"
                value={formData.additionalInfo}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Book Your Tattoo Session</h1>
        <p>Complete the form below to request an appointment with our artists</p>
      </div>

      <div className="progress-bar">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`progress-step ${index + 1 <= step ? 'active' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">
              {index === 0 ? 'Personal Info' : index === 1 ? 'Tattoo Details' : 'Additional Info'}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {renderFormStep()}

        <div className="form-navigation">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="nav-button prev">
              Previous
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" onClick={nextStep} className="nav-button next">
              Next
            </button>
          ) : (
            <button type="submit" className="nav-button submit">
              Submit Request
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Booking;