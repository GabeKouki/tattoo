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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Multi-session state
  const [currentSession, setCurrentSession] = useState(0);
  const [sessionBookings, setSessionBookings] = useState([]);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [calculatedEndTime, setCalculatedEndTime] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("booking_links")
          .select("*, inquiries(*)")
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
        
        // Initialize session bookings array
        if (data.is_multi_session) {
          setSessionBookings(new Array(data.sessions_info.length).fill(null));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [token]);

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
      const currentSession = bookingDetails.sessions_info[currentSession];
      const duration = currentSession.duration * 60; // Convert to minutes

      availability.forEach((time) => {
        let [currentHours, currentMinutes] = time.start_time.split(":").map(Number);
        const [endHours, endMinutes] = time.end_time.split(":").map(Number);
        
        while (currentHours < endHours || (currentHours === endHours && currentMinutes < endMinutes)) {
          const startTime = `${currentHours.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`;
          const endTime = addMinutes(startTime, duration);

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
    const currentSession = bookingDetails.sessions_info[currentSession];
    const endTime = addMinutes(startTime, currentSession.duration * 60);
    setCalculatedEndTime(endTime);
  };
  const handleSessionBooking = () => {
    if (!selectedDate || !selectedStartTime) {
      setError("Please select both date and time.");
      return;
    }

    const newSessionBookings = [...sessionBookings];
    newSessionBookings[currentSession] = {
      date: selectedDate.toISOString().split("T")[0],
      start_time: selectedStartTime,
      end_time: calculatedEndTime,
      duration: bookingDetails.sessions_info[currentSession].duration
    };
    setSessionBookings(newSessionBookings);

    if (currentSession < bookingDetails.sessions_info.length - 1) {
      // Move to next session
      setCurrentSession(currentSession + 1);
      setSelectedDate(null);
      setSelectedStartTime(null);
      setCalculatedEndTime(null);
      setAvailableSlots([]);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Create Stripe payment session
      const { data: stripeSession, error: stripeError } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: 10000, // $100 in cents
          success_url: `${window.location.origin}/book-appointment/${token}/success`,
          cancel_url: `${window.location.origin}/book-appointment/${token}`,
          customer_email: bookingDetails.client_email
        }
      });

      if (stripeError) throw stripeError;

      // Redirect to Stripe checkout
      window.location.href = stripeSession.url;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  const handleFinalBooking = async () => {
    try {
      setLoading(true);
      const parentAppointment = {
        artist_id: bookingDetails.artist_id,
        client_name: bookingDetails.inquiries.client_name,
        client_email: bookingDetails.client_email,
        client_phone: bookingDetails.inquiries.client_phone,
        is_multi_session: bookingDetails.is_multi_session,
        deposit_paid: false,
        status: 'pending'
      };

      // Create parent appointment
      const { data: parentData, error: parentError } = await supabase
        .from('appointments')
        .insert([parentAppointment])
        .select()
        .single();

      if (parentError) throw parentError;

      // Create individual session appointments
      const sessionAppointments = sessionBookings.map((session, index) => ({
        artist_id: bookingDetails.artist_id,
        client_name: bookingDetails.inquiries.client_name,
        client_email: bookingDetails.client_email,
        client_phone: bookingDetails.inquiries.client_phone,
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
        duration: session.duration,
        is_multi_session: true,
        session_number: index + 1,
        parent_appointment_id: parentData.id,
        deposit_paid: false,
        status: 'pending'
      }));

      const { error: sessionsError } = await supabase
        .from('appointments')
        .insert(sessionAppointments);

      if (sessionsError) throw sessionsError;

      setSuccess('Appointments scheduled successfully! Proceeding to deposit payment...');
      setTimeout(() => handlePayment(), 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to schedule appointments. Please try again.');
      setLoading(false);
    }
  };

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

  if (loading) return (
    <div className="book-appointment">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="book-appointment">
      <div className="error-container">
        <span className="material-icons">error</span>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="book-appointment">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Appointment</h1>
          {bookingDetails?.is_multi_session && (
            <div className="session-progress">
              {bookingDetails.sessions_info.map((_, index) => (
                <div 
                  key={index}
                  className={`progress-step ${index === currentSession ? 'active' : ''} 
                    ${sessionBookings[index] ? 'completed' : ''}`}
                >
                  Session {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="booking-details">
          <div className="info-group">
            <span className="material-icons">person</span>
            <div>
              <label>Client</label>
              <p>{bookingDetails?.inquiries.client_name}</p>
            </div>
          </div>
          <div className="info-group">
            <span className="material-icons">email</span>
            <div>
              <label>Email</label>
              <p>{bookingDetails?.client_email}</p>
            </div>
          </div>
          <div className="info-group">
            <span className="material-icons">schedule</span>
            <div>
              <label>Duration</label>
              <p>{bookingDetails?.sessions_info[currentSession].duration} hours</p>
            </div>
          </div>
          {bookingDetails?.sessions_info[currentSession].notes && (
            <div className="info-group">
              <span className="material-icons">note</span>
              <div>
                <label>Session Notes</label>
                <p>{bookingDetails.sessions_info[currentSession].notes}</p>
              </div>
            </div>
          )}
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
          </div>
        )}

        {selectedStartTime && (
          <div className="appointment-summary">
            <h3>Session {currentSession + 1} Details</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="material-icons">event</span>
                <div>
                  <label>Date</label>
                  <p>{selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
              <div className="summary-item">
                <span className="material-icons">schedule</span>
                <div>
                  <label>Time</label>
                  <p>{timeHelpers.convertTo12Hour(selectedStartTime)} - {timeHelpers.convertTo12Hour(calculatedEndTime)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStartTime && (
          <button 
            className="action-button"
            onClick={currentSession === bookingDetails.sessions_info.length - 1 ? 
              handleFinalBooking : handleSessionBooking}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons spinning">sync</span>
                Processing...
              </>
            ) : currentSession === bookingDetails.sessions_info.length - 1 ? (
              <>
                <span className="material-icons">check_circle</span>
                Complete Booking & Pay Deposit
              </>
            ) : (
              <>
                <span className="material-icons">arrow_forward</span>
                Book Next Session
              </>
            )}
          </button>
        )}

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default BookAppointment;