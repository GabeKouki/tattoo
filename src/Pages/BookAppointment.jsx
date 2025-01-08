import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../Utils/SupabaseClient";
import "./BookAppointment.css";

const timeHelpers = {
  convertTo12Hour: (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  },
  
  convertTo24Hour: (time12) => {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

const BookAppointment = () => {
  const { token } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [calculatedEndTime, setCalculatedEndTime] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("booking_links")
          .select("*")
          .eq("token", token)
          .single();

        if (error || !data) {
          throw new Error("Invalid or expired booking link.");
        }

        const now = new Date();
        if (new Date(data.expiration) < now) {
          throw new Error("This booking link has expired.");
        }

        setBookingDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [token]);

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + minutes);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const fetchAvailability = async (date) => {
    try {
      const dayOfWeekIndex = new Date(date).getDay();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = days[dayOfWeekIndex];

      const { data: availability, error } = await supabase
        .from("availability")
        .select("*")
        .eq("artist_id", bookingDetails.artist_id)
        .eq("day_of_week", dayOfWeek)
        .eq("is_available", true);

      if (error) throw error;

      if (!availability || availability.length === 0) {
        setAvailableSlots([]);
        return;
      }

      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("artist_id", bookingDetails.artist_id)
        .eq("date", date);

      if (appointmentsError) throw appointmentsError;

      const slots = [];
      const duration = bookingDetails.duration * 60; // Convert to minutes

      availability.forEach((time) => {
        let [currentHours, currentMinutes] = time.start_time.split(":").map(Number);
        const [endHours, endMinutes] = time.end_time.split(":").map(Number);
        
        // Generate hourly slots
        while (currentHours < endHours || (currentHours === endHours && currentMinutes < endMinutes)) {
          const startTime = `${currentHours.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`;
          const endTime = addMinutes(startTime, duration);

          // Check if slot overlaps with any existing appointment
          const isBlocked = appointments.some((appointment) => {
            const apptStart = appointment.start_time;
            const apptEnd = appointment.end_time;
            
            return (
              (startTime >= apptStart && startTime < apptEnd) ||
              (endTime > apptStart && endTime <= apptEnd) ||
              (startTime <= apptStart && endTime >= apptEnd)
            );
          });

          if (!isBlocked && addMinutes(startTime, duration) <= time.end_time) {
            slots.push(startTime);
          }

          // Move to next hour
          currentMinutes = 0;
          currentHours += 1;
        }
      });

      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartTime(null);
    setCalculatedEndTime(null);
    fetchAvailability(date.toISOString().split("T")[0]);
  };

  const handleTimeSelection = (startTime) => {
    setSelectedStartTime(startTime);
    const endTime = addMinutes(startTime, bookingDetails.duration * 60);
    setCalculatedEndTime(endTime);
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedStartTime) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          artist_id: bookingDetails.artist_id,
          client_name: bookingDetails.client_name,
          client_email: bookingDetails.client_email,
          duration: bookingDetails.duration,
          date: selectedDate.toISOString().split("T")[0],
          start_time: selectedStartTime,
          end_time: calculatedEndTime,
          status: "pending",
        },
      ]);

      if (error) throw error;

      alert("Appointment scheduled successfully!");
      // You might want to redirect the user or clear the form here
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      alert("Failed to schedule appointment.");
    }
  };

  if (loading) return <div className="loading-state">Loading booking details...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="book-appointment">
      <div className="booking-container">
        <h1>Book Your Appointment</h1>
        
        <div className="booking-details">
          <div className="detail-item">
            <span className="label">Client:</span>
            <span className="value">{bookingDetails.client_name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{bookingDetails.client_email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span className="value">{bookingDetails.duration} hours</span>
          </div>
        </div>

        <div className="calendar-section">
          <h2>Select Date</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            className="custom-calendar"
          />
        </div>

        {selectedDate && (
          <div className="time-selection">
            <h2>Select Time</h2>
            <div className="time-slots">
              {availableSlots.length === 0 ? (
                <p className="no-slots">No available times for this date.</p>
              ) : (
                availableSlots.map((time, idx) => (
                  <button
                    key={idx}
                    className={`time-slot ${selectedStartTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelection(time)}
                  >
                    {timeHelpers.convertTo12Hour(time)}
                  </button>
                ))
              )}
            </div>

            {selectedStartTime && calculatedEndTime && (
              <div className="appointment-summary">
                <h3>Appointment Details</h3>
                <div className="time-details">
                  <div className="time-item">
                    <span className="label">Start Time:</span>
                    <span className="value">{timeHelpers.convertTo12Hour(selectedStartTime)}</span>
                  </div>
                  <div className="time-item">
                    <span className="label">End Time:</span>
                    <span className="value">{timeHelpers.convertTo12Hour(calculatedEndTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedStartTime && (
          <button 
            onClick={handleScheduleAppointment}
            className="schedule-button"
          >
            Schedule Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;