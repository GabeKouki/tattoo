import React, { useState, useEffect } from "react";
import "./ArtistSchedule.css";
import { supabase } from "../../Utils/SupabaseClient";

const ArtistSchedule = ({ schedule, fetchSchedule, artistId }) => {
  const [currentView, setCurrentView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isBlockingTime, setIsBlockingTime] = useState(false);
  const [blockOffDate, setBlockOffDate] = useState(null);
  const [blockStartTime, setBlockStartTime] = useState('');
  const [blockEndTime, setBlockEndTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(1);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (schedule) {
      setAppointments(schedule);
    }
    fetchAvailability();
  }, [schedule]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("artist_id", artistId);

      if (error) throw error;
      setAvailability(data || []);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  const handleBlockTime = async () => {
    if (!blockOffDate || !blockStartTime || !blockEndTime) {
      alert('Please select a date and time range');
      return;
    }

    try {
      const baseDate = new Date(blockOffDate);
      const dates = [];

      // Generate dates for recurring blocks
      for (let i = 0; i < (isRecurring ? recurringWeeks : 1); i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(currentDate.getDate() + (i * 7));
        dates.push(currentDate.toISOString().split('T')[0]);
      }

      // Create appointments for blocked time
      const blockedAppointments = dates.map(date => ({
        artist_id: artistId,
        date: date,
        start_time: blockStartTime,
        end_time: blockEndTime,
        status: 'blocked',
        client_name: 'BLOCKED',
        client_email: 'blocked@time.com',
        duration: (new Date(`2000-01-01T${blockEndTime}`) - new Date(`2000-01-01T${blockStartTime}`)) / (1000 * 60 * 60)
      }));

      const { error } = await supabase
        .from('appointments')
        .insert(blockedAppointments);

      if (error) throw error;

      alert('Time blocked successfully!');
      fetchSchedule();
      setIsBlockingTime(false);
    } catch (err) {
      console.error('Error blocking time:', err);
      alert('Failed to block time');
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setSelectedDate(newDate);
  };

  const formatAppointmentTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAppointmentStatus = (appointment) => {
    if (appointment.status === 'blocked') return 'blocked';
    if (!appointment.deposit_paid) return 'pending-deposit';
    return appointment.status;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const generateMiniCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="mini-calendar-day empty"></div>);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasAppointments = appointments.some(
        app => new Date(app.date).toDateString() === date.toDateString()
      );

      days.push(
        <div
          key={i}
          className={`mini-calendar-day ${isSelected ? 'selected' : ''} ${hasAppointments ? 'has-appointments' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          {i}
          {hasAppointments && <span className="appointment-indicator"></span>}
        </div>
      );
    }

    return days;
  };

  const BlockTimeDialog = () => (
    <div className="modal-overlay">
      <div className="block-time-dialog">
        <div className="dialog-header">
          <h2>Block Off Time</h2>
          <button className="close-button" onClick={() => setIsBlockingTime(false)}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="dialog-content">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={blockOffDate || ''}
              onChange={(e) => setBlockOffDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={blockStartTime}
              onChange={(e) => setBlockStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={blockEndTime}
              onChange={(e) => setBlockEndTime(e.target.value)}
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="recurring-check"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label htmlFor="recurring-check">Recurring block?</label>
          </div>
          {isRecurring && (
            <div className="form-group">
              <label>Number of weeks</label>
              <input
                type="number"
                min="1"
                max="52"
                value={recurringWeeks}
                onChange={(e) => setRecurringWeeks(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
        <div className="dialog-actions">
          <button className="cancel-button" onClick={() => setIsBlockingTime(false)}>
            Cancel
          </button>
          <button onClick={handleBlockTime} className="block-button">
            Block Time
          </button>
        </div>
      </div>
    </div>
  );
  const filterAppointments = () => {
    if (currentView === "day") {
      return appointments.filter(
        (appointment) =>
          new Date(appointment.date).toDateString() === selectedDate.toDateString()
      );
    } else if (currentView === "week") {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
      });
    } else if (currentView === "month") {
      return appointments.filter(
        (appointment) =>
          new Date(appointment.date).getMonth() === selectedDate.getMonth() &&
          new Date(appointment.date).getFullYear() === selectedDate.getFullYear()
      );
    }
    return [];
  };

  const renderAppointmentCard = (appointment) => {
    const status = getAppointmentStatus(appointment);
    return (
      <div className={`appointment-card ${status}`}>
        <div className="appointment-card-header">
          <span className="time">
            {formatAppointmentTime(appointment.start_time)} - {formatAppointmentTime(appointment.end_time)}
          </span>
          <span className={`status-badge ${status}`}>
            {status === 'blocked' ? 'Blocked' : status}
          </span>
        </div>
        {status !== 'blocked' && (
          <>
            <h4>{appointment.client_name}</h4>
            <div className="appointment-details">
              {appointment.client_phone && (
                <span className="detail">
                  <span className="material-icons">phone</span>
                  {appointment.client_phone}
                </span>
              )}
              <span className="detail">
                <span className="material-icons">email</span>
                {appointment.client_email}
              </span>
              {appointment.notes && (
                <span className="detail">
                  <span className="material-icons">note</span>
                  {appointment.notes}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDayView = () => {
    const filteredAppointments = filterAppointments();
    return (
      <div className="day-view">
        <div className="time-slots">
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            const time = `${hour}:00`;
            const hourAppointments = filteredAppointments.filter(
              app => app.start_time.startsWith(hour)
            );

            return (
              <div key={hour} className="time-slot">
                <div className="time-label">{formatAppointmentTime(`${hour}:00`)}</div>
                <div className="appointments-container">
                  {hourAppointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-wrapper">
                      {renderAppointmentCard(appointment)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    return (
      <div className="week-view">
        <div className="week-header">
          {Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return (
              <div key={i} className="day-header">
                <span className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="date">{day.getDate()}</span>
              </div>
            );
          })}
        </div>
        <div className="week-grid">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + dayIndex);
            const dayAppointments = appointments.filter(
              app => new Date(app.date).toDateString() === currentDay.toDateString()
            );

            return (
              <div key={dayIndex} className="day-column">
                {dayAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-wrapper">
                    {renderAppointmentCard(appointment)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const totalDays = daysInMonth + firstDay;
    const totalWeeks = Math.ceil(totalDays / 7);

    return (
      <div className="month-view">
        <div className="month-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        <div className="month-grid">
          {Array.from({ length: totalWeeks * 7 }).map((_, index) => {
            const dayNumber = index - firstDay + 1;
            const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

            if (!isValidDay) {
              return <div key={index} className="day-cell empty"></div>;
            }

            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNumber);
            const dayAppointments = appointments.filter(
              app => new Date(app.date).toDateString() === date.toDateString()
            );

            return (
              <div key={index} className="day-cell">
                <div className="day-number">{dayNumber}</div>
                <div className="day-appointments">
                  {dayAppointments.map(appointment => (
                    <div key={appointment.id} className="month-appointment">
                      {renderAppointmentCard(appointment)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ArtistSchedule">
      <div className="schedule-toolbar">
        <button
          className="block-time-button"
          onClick={() => setIsBlockingTime(true)}
        >
          <span className="material-icons">block</span>
          Block Time Off
        </button>
        <div className="view-controls">
          <button
            className={`view-button ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button
            className={`view-button ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button
            className={`view-button ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
        </div>
        <div className="date-navigation">
          <button onClick={() => handleDateChange(-1)}>
            <span className="material-icons">chevron_left</span>
          </button>
          <span className="current-date">
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              ...(currentView === 'day' && { day: 'numeric' })
            })}
          </span>
          <button onClick={() => handleDateChange(1)}>
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="schedule-content">
        {currentView === 'day' && renderDayView()}
        {currentView === 'week' && renderWeekView()}
        {currentView === 'month' && renderMonthView()}
      </div>

      {isBlockingTime && <BlockTimeDialog />}
    </div>
  );
};

export default ArtistSchedule;