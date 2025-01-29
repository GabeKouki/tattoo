import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "../Components/Calendar/Calendar";
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
  const [workflowStep, setWorkflowStep] = useState('booking'); // 'booking', 'review', 'payment', 'confirmation'
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

        // Determine workflow step based on booking link status
        if (data.status === 'paid') {
          setWorkflowStep('confirmation');
          setSuccess('Your appointments have been scheduled and paid. Thank you!');
        } else if (data.status === 'scheduled') {
          setWorkflowStep('payment');
        } else {
          // Initialize session bookings array
          if (data.is_multi_session) {
            setSessionBookings(new Array(data.sessions_info.length).fill(null));
          } else {
            setSessionBookings([null]); // Single session
          }
          setWorkflowStep('booking');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [token]);

  useEffect(() => {
    // Handle payment success
    if (window.location.pathname.endsWith('/success')) {
      if (bookingDetails && bookingDetails.status !== 'paid') {
        const updateBookingStatus = async () => {
          try {
            // Update booking link status to 'paid'
            await supabase
              .from('booking_links')
              .update({ status: 'paid' })
              .eq('id', bookingDetails.id);

            // Update appointments to set deposit_paid to true
            await supabase
              .from('appointments')
              .update({ deposit_paid: true })
              .eq('client_email', bookingDetails.client_email)
              .eq('artist_id', bookingDetails.artist_id)
              .eq('status', 'waiting');

            setWorkflowStep('confirmation');
            setSuccess('Your appointments have been scheduled and paid. Thank you!');
          } catch (err) {
            console.error('Error updating booking status:', err);
            setError('Failed to update booking status after payment.');
          }
        };

        updateBookingStatus();
      }
    }
  }, [bookingDetails]);

  const checkSessionConflicts = (newDate, newStartTime, newEndTime) => {
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStartMinutes = timeToMinutes(newStartTime);
    const newEndMinutes = timeToMinutes(newEndTime);

    // Check against all previously booked sessions
    for (let session of sessionBookings) {
      if (session) {
        if (session.date === newDate) {
          const existingStartMinutes = timeToMinutes(session.start_time);
          const existingEndMinutes = timeToMinutes(session.end_time);

          if (
            (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
            (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
            (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
          ) {
            return true; // Conflict found
          }
        }
      }
    }
    return false; // No conflicts
  };

  const fetchAvailability = async (date) => {
    try {
      const selectedDateObj = new Date(date); // Convert string to Date object
      const dayOfWeekIndex = selectedDateObj.getDay(); // 0 (Sunday) to 6 (Saturday)
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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

      // Get existing appointments for the date
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("artist_id", bookingDetails.artist_id)
        .eq("date", date)
        .in('status', ['scheduled', 'waiting']);

      if (appointmentsError) throw appointmentsError;

      const slots = [];
      const sessionDuration = bookingDetails.sessions_info[currentSession]?.duration * 60;

      availability.forEach((timeSlot) => {
        let currentTime = new Date(`2000-01-01 ${timeSlot.start_time}`);
        const endTime = new Date(`2000-01-01 ${timeSlot.end_time}`);

        while (currentTime < endTime) {
          const startTimeStr = currentTime.toTimeString().slice(0, 5);
          const potentialEndTime = new Date(currentTime.getTime() + sessionDuration * 60000);
          const endTimeStr = potentialEndTime.toTimeString().slice(0, 5);

          if (potentialEndTime <= endTime) {
            const isBlocked = appointments.some(appointment => {
              const apptStart = appointment.start_time;
              const apptEnd = appointment.end_time;

              return (
                (startTimeStr >= apptStart && startTimeStr < apptEnd) ||
                (endTimeStr > apptStart && endTimeStr <= apptEnd) ||
                (startTimeStr <= apptStart && endTimeStr >= apptEnd)
              );
            });

            // Also check against our already booked sessions
            const conflictsWithSessions = checkSessionConflicts(
              date,
              startTimeStr,
              endTimeStr
            );

            if (!isBlocked && !conflictsWithSessions) {
              slots.push(startTimeStr);
            }
          }

          // Increment by 30 minutes
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
      });

      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to fetch available time slots.");
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartTime(null);
    setCalculatedEndTime(null);
    const dateString = date.toISOString().split("T")[0];
    fetchAvailability(dateString);
  };

  const handleTimeSelection = (startTime) => {
    setSelectedStartTime(startTime);
    const sessionInfo = bookingDetails.sessions_info[currentSession];
    const endTime = addMinutes(startTime, sessionInfo.duration * 60);
    setCalculatedEndTime(endTime);
  };

  const handleSessionBooking = () => {
    if (!selectedDate || !selectedStartTime) {
      setError("Please select both date and time.");
      return;
    }

    const selectedDateString = selectedDate.toISOString().split("T")[0];

    // Check for conflicts with existing sessions
    if (checkSessionConflicts(
      selectedDateString,
      selectedStartTime,
      calculatedEndTime
    )) {
      setError("This time slot conflicts with another session you've booked. Please choose a different time.");
      return;
    }

    // Create new session object
    const newSession = {
      date: selectedDateString,
      start_time: selectedStartTime,
      end_time: calculatedEndTime,
      duration: bookingDetails.sessions_info[currentSession].duration
    };

    // Update the bookings directly
    const updatedBookings = [...sessionBookings];
    updatedBookings[currentSession] = newSession;

    setSessionBookings(updatedBookings);

    setError("");

    // Reset selections
    setSelectedDate(null);
    setSelectedStartTime(null);
    setCalculatedEndTime(null);
    setAvailableSlots([]);

    // Move to next session
    setCurrentSession(currentSession + 1);

    // If all sessions are booked, proceed to review
    if (currentSession + 1 >= bookingDetails.sessions_info.length) {
      setWorkflowStep('review');
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

      // Verify all sessions are booked
      const unbooked = sessionBookings.findIndex(session => session === null);
      if (unbooked !== -1) {
        throw new Error(`Please complete booking for session ${unbooked + 1} before proceeding.`);
      }

      const appointmentData = sessionBookings.map((session, index) => ({
        artist_id: bookingDetails.artist_id,
        client_name: bookingDetails.inquiries.client_name,
        client_email: bookingDetails.client_email,
        client_phone: bookingDetails.inquiries.client_phone,
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
        duration: session.duration,
        is_multi_session: bookingDetails.is_multi_session,
        session_number: bookingDetails.is_multi_session ? index + 1 : null,
        parent_appointment_id: null, // Will set later if multi-session
        deposit_paid: false,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        booking_id: bookingDetails.id
      }));

      // Handle single session booking
      if (!bookingDetails.is_multi_session) {
        const { error: singleSessionError } = await supabase
          .from('appointments')
          .insert([appointmentData[0]]);

        if (singleSessionError) throw singleSessionError;

        // Update booking link status to 'scheduled'
        await supabase
          .from('booking_links')
          .update({ status: 'scheduled' })
          .eq('id', bookingDetails.id);

        setWorkflowStep('payment');
      } else {
        // Handle multi-session booking
        // Create parent appointment
        const parentAppointment = {
          artist_id: bookingDetails.artist_id,
          client_name: bookingDetails.inquiries.client_name,
          client_email: bookingDetails.client_email,
          client_phone: bookingDetails.inquiries.client_phone,
          is_multi_session: true,
          deposit_paid: false,
          status: 'scheduled',
          date: appointmentData[0].date,
          start_time: appointmentData[0].start_time,
          end_time: appointmentData[0].end_time,
          duration: appointmentData[0].duration,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: parentData, error: parentError } = await supabase
          .from('appointments')
          .insert([parentAppointment])
          .select()
          .single();

        if (parentError) throw parentError;

        // Update child appointments with parent ID
        //TODO CHeck if the fix worked
        const sessionAppointments = appointmentData.map(appointment => ({
          ...appointment,
          parent_appointment_id: parentData.id,
          status: 'scheduled'
        }));

        const { error: sessionsError } = await supabase
          .from('appointments')
          .insert(sessionAppointments);

        if (sessionsError) throw sessionsError;

        // Update booking link status to 'scheduled'
        await supabase
          .from('booking_links')
          .update({ status: 'scheduled' })
          .eq('id', bookingDetails.id);

        setWorkflowStep('payment');
      }

      setSuccess('Appointments scheduled successfully! Proceeding to deposit payment...');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to schedule appointments. Please try again.');
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

  if (workflowStep === 'confirmation') {
    return (
      <div className="book-appointment">
        <div className="booking-container">
          <div className="confirmation-screen">
            <h1>Booking Confirmed</h1>
            <p>Your appointments have been scheduled and paid. Thank you!</p>
          </div>
        </div>
      </div>
    );
  }

  if (workflowStep === 'payment') {
    return (
      <div className="book-appointment">
        <div className="booking-container">
          <h1>Pay Deposit</h1>
        </div>
      </div>
    );
  }

  if (workflowStep === 'review') {
    return (
      <div className="book-appointment">
        <div className="booking-container">
          <h1>Review Your Appointments</h1>
          {sessionBookings.map((session, index) => (
            <div key={index} className="appointment-summary">
              <h3>Session {index + 1}</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="material-icons">event</span>
                  <div>
                    <label>Date</label>
                    <p>{new Date(session.date).toLocaleDateString('en-US', {
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
                    <p>{timeHelpers.convertTo12Hour(session.start_time)} - {timeHelpers.convertTo12Hour(session.end_time)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            className="action-button"
            onClick={handleFinalBooking}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons spinning">sync</span>
                Processing...
              </>
            ) : (
              <>
                <span className="material-icons">check_circle</span>
                Complete Booking & Pay Deposit
              </>
            )}
          </button>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  // Booking step
  return (
    <div className="book-appointment">
      <button onClick={() => setWorkflowStep('payment')}>Set</button>
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
              <p>{bookingDetails?.sessions_info[currentSession]?.duration} hours</p>
            </div>
          </div>
          {bookingDetails?.sessions_info[currentSession]?.notes && (
            <div className="info-group">
              <span className="material-icons">note</span>
              <div>
                <label>Session Notes</label>
                <p>{bookingDetails.sessions_info[currentSession].notes || 'No notes provided'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="calendar-section">
          <h2>Select Date</h2>
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
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
            onClick={handleSessionBooking}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons spinning">sync</span>
                Processing...
              </>
            ) : (
              currentSession + 1 >= bookingDetails.sessions_info.length ? (
                <>
                  <span className="material-icons">arrow_forward</span>
                  Proceed to Review
                </>
              ) : (
                <>
                  <span className="material-icons">arrow_forward</span>
                  Book Next Session
                </>
              )
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