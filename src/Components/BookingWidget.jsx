import React from 'react';
import { InlineWidget } from 'react-calendly';

const BookingWidget = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Book an Appointment</h2>
      <InlineWidget 
        url="https://calendly.com/gabekouki02" 
        styles={{ height: '600px', width: '100%' }} 
      />
    </div>
  );
};

export default BookingWidget;