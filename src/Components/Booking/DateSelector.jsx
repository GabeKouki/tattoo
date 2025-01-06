// src/Components/Booking/DateSelector.jsx
import React, { useState } from 'react';
import { format, addDays, isBefore, startOfDay, isWeekend, set } from 'date-fns';
import './BookingStyles.css';

const DateSelector = ({ artistId, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = startOfDay(new Date());
    const firstDayOfMonth = set(currentMonth, { date: 1 }); // First day of current month view
    const lastDayOfMonth = set(currentMonth, { date: 32 }); // This will roll over to next month
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Add empty cells for days before first of month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ date: null, isDisabled: true });
    }
    
    // Add actual days
    let currentDate = firstDayOfMonth;
    while (currentDate.getMonth() === currentMonth.getMonth()) {
      const isDisabled = isBefore(currentDate, today) || isWeekend(currentDate);
      days.push({
        date: new Date(currentDate),
        isDisabled
      });
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };

  const handleDateClick = (day) => {
    if (day.date && !day.isDisabled) {
      setSelectedDate(day.date);
      onDateSelect(day.date);
    }
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + increment));
    setCurrentMonth(new Date(newMonth));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isDisabled ? 'disabled' : ''} 
              ${day.date && selectedDate && 
                format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') 
                ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day.date ? format(day.date, 'd') : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;