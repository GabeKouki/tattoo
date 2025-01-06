// src/Components/Booking/TimeSlots.jsx
import React from 'react';
import { format } from 'date-fns';
import './BookingStyles.css';

const TimeSlots = ({ selectedDate, availableSlots, onTimeSelect, selectedTime }) => {
  if (!selectedDate) {
    return <div className="time-slots-message">Please select a date first</div>;
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="time-slots-message">
        No available time slots for {format(selectedDate, 'MMMM d, yyyy')}
      </div>
    );
  }

  return (
    <div className="time-slots-container">
      <h3>Available Times for {format(selectedDate, 'MMMM d, yyyy')}</h3>
      <div className="time-slots-grid">
        {availableSlots.map((slot, index) => (
          <button
            key={index}
            className={`time-slot ${selectedTime === slot.startTime ? 'selected' : ''}`}
            onClick={() => onTimeSelect(slot)}
          >
            {slot.startTime}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;