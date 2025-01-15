// src/Components/Calendar.jsx
import React from 'react';
import './Calendar.css';

const Calendar = ({ value, onChange, minDate }) => {
  const [currentDate, setCurrentDate] = React.useState(value || new Date());
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const generateDays = () => {
    const days = [];
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isDisabled = minDate && date < minDate;
      const isSelected = value && 
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onChange(date)}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    ));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className="nav-button"
          onClick={() => navigateMonth(-1)}
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <div className="current-month">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button 
          className="nav-button"
          onClick={() => navigateMonth(1)}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div className="calendar-days-header">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="calendar-grid">
        {generateDays()}
      </div>
    </div>
  );
};

export default Calendar;