// src/Components/Booking/BookingConfirmation.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import './BookingStyles.css';

const BookingConfirmation = ({ 
  selectedDate, 
  selectedTime, 
  duration,
  artistId,
  onConfirm,
  onBack,
  isLoading,
  error
}) => {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(clientInfo);
  };

  const handleChange = (e) => {
    setClientInfo({
      ...clientInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking-confirmation">
      <h2>Confirm Your Appointment</h2>
      
      <div className="booking-summary">
        <h3>Appointment Details</h3>
        <div className="summary-details">
          <p><strong>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> {selectedTime.startTime} - {selectedTime.endTime}</p>
          <p><strong>Duration:</strong> {duration.replace('hour', ' Hour')}</p>
          <p><strong>Deposit Required:</strong> $100</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="confirmation-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={clientInfo.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder='John Doe'
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={clientInfo.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder='yourname@example.com'
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={clientInfo.phone}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder='(555) 555-5555'
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={clientInfo.notes}
            onChange={handleChange}
            rows="4"
            disabled={isLoading}
            placeholder="Any additional information about your appointment..."
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="confirmation-actions">
          <button 
            type="button" 
            onClick={onBack} 
            className="back-button"
            disabled={isLoading}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="confirm-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Pay Deposit & Confirm'}
          </button>
        </div>

        <div className="booking-notes">
          <p>* A $100 non-refundable deposit is required to secure your appointment</p>
          <p>* Please arrive 15 minutes before your scheduled time</p>
          <p>* Bring a valid form of ID</p>
        </div>
      </form>
    </div>
  );
};

export default BookingConfirmation;