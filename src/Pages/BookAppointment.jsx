import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../Utils/SupabaseClient";
import "./BookAppointment.css";

const BookAppointment = () => {
  const { token } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
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
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayOfWeek = days[dayOfWeekIndex];
  
      console.log('Fetching availability for:', {
        artist_id: bookingDetails.artist_id,
        day_of_week: dayOfWeek,
      });

      const { data: availability, error } = await supabase
        .from("availability")
        .select("*")
        .eq("artist_id", bookingDetails.artist_id)
        .eq("day_of_week", dayOfWeek)
        .eq("is_available", true);

      if (error) throw error;

      console.log("Artist availability:", availability);

      if (!availability || availability.length === 0) {
        console.log("No availability found for this artist on this day.");
        setAvailableSlots([]);
        return;
      }

      const slots = [];
      const duration = bookingDetails.duration * 60; // Convert to minutes
      if (!duration || duration <= 0) {
        console.error("Invalid duration:", duration);
        return;
      }

      availability.forEach((time) => {
        let [currentHours, currentMinutes] = time.start_time.split(":").map(Number);
        const [endHours, endMinutes] = time.end_time.split(":").map(Number);

        const endTimeInMinutes = endHours * 60 + endMinutes;

        while (currentHours * 60 + currentMinutes + duration <= endTimeInMinutes) {
          const startTime = `${currentHours.toString().padStart(2, "0")}:${currentMinutes
            .toString()
            .padStart(2, "0")}`;
          const endTime = addMinutes(startTime, duration);

          slots.push({ start: startTime, end: endTime });

          // Increment time by 30 minutes for overlapping slots
          currentMinutes += 30;
          if (currentMinutes >= 60) {
            currentHours += Math.floor(currentMinutes / 60);
            currentMinutes %= 60;
          }
        }
      });

      console.log("Generated slots:", slots);
      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    fetchAvailability(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          artist_id: bookingDetails.artist_id,
          client_name: bookingDetails.client_email,
          client_email: bookingDetails.client_email,
          duration: bookingDetails.duration,
          date: selectedDate.toISOString().split("T")[0],
          start_time: selectedTime,
          end_time: addMinutes(selectedTime, bookingDetails.duration * 60),
          status: "waiting",
        },
      ]);

      if (error) throw error;

      alert("Appointment scheduled successfully!");
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      alert("Failed to schedule appointment.");
    }
  };

  if (loading) return <p>Loading booking details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="BookAppointment">
      <h1>Book an Appointment</h1>
      <p>Client Email: {bookingDetails.client_email}</p>
      <p>Appointment Duration: {bookingDetails.duration} hours</p>

      <div className="calendar-container">
        <h3>Select a Date:</h3>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
        />
      </div>
      {availableSlots.length === 0 && (
        <p>No available slots for the selected date.</p>
      )}
      {availableSlots.length > 0 && (
        <div className="available-slots">
          <h3>Available Slots:</h3>
          {availableSlots.map((slot, idx) => (
            <button
              key={idx}
              className={`slot-button ${selectedTime === slot.start ? "selected" : ""}`}
              onClick={() => setSelectedTime(slot.start)}
            >
              {slot.start} - {slot.end}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleScheduleAppointment} className="schedule-button">
        Schedule Appointment
      </button>
    </div>
  );
};

export default BookAppointment;
