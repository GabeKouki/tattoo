import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../../Utils/SupabaseClient";
import "./ArtistSchedule.css";

const ArtistSchedule = ({ schedule, fetchSchedule, artistId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentsOnDate, setAppointmentsOnDate] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const selectedDateString = date.toISOString().split("T")[0];

    const filteredAppointments = schedule.filter(
      (appointment) => appointment.date === selectedDateString
    );
    setAppointmentsOnDate(filteredAppointments);
  };

  const blockOffDate = async () => {
    if (!selectedDate) {
      alert("Please select a date to block.");
      return;
    }

    const selectedDateString = selectedDate.toISOString().split("T")[0];

    try {
      setLoading(true);

      const { error } = await supabase
        .from("availability")
        .update({ is_available: false })
        .eq("artist_id", artistId)
        .eq("date", selectedDateString);

      if (error) throw error;

      alert(`Date ${selectedDateString} has been successfully blocked off.`);
      fetchSchedule(); // Refresh the schedule
    } catch (err) {
      console.error("Error blocking off date:", err);
      alert("Failed to block off date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ArtistSchedule">
      <h1>Artist Schedule</h1>
      <div className="calendar-container">
        <h3>Select a Date:</h3>
        <Calendar onChange={handleDateChange} value={selectedDate} />
      </div>

      {selectedDate && (
        <div className="appointments-container">
          <h3>Appointments on {selectedDate.toDateString()}:</h3>
          {appointmentsOnDate.length === 0 ? (
            <p>No appointments scheduled for this day.</p>
          ) : (
            <ul className="appointments-list">
              {appointmentsOnDate.map((appointment) => (
                <li key={appointment.id} className="appointment-item">
                  <p><strong>Client:</strong> {appointment.client_name}</p>
                  <p><strong>Time:</strong> {appointment.start_time} - {appointment.end_time}</p>
                  <p><strong>Details:</strong> {appointment.notes || "No additional details"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={blockOffDate}
        disabled={loading}
        className="block-date-button"
      >
        {loading ? "Blocking..." : "Block Off This Date"}
      </button>
    </div>
  );
};

export default ArtistSchedule;
