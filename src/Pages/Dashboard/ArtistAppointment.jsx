import './ArtistAppointment.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { set } from 'date-fns';

const ArtistAppointment = ({ viewingAppointments, setViewingAppointments }) => {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingData, setBookingData] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          child_sessions:appointments(
            id,
            date,
            start_time,
            end_time,
            status,
            session_number
          )
        `)
        .is('parent_appointment_id', null)
        .order('date', { ascending: true });

      if (session.user.app_metadata.role !== 'admin') {
        query = query.eq('artist_id', session.user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setAppointments(data.map(appointment => ({
        ...appointment,
        child_sessions: appointment.child_sessions?.sort((a, b) => a.session_number - b.session_number)
      })));
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewingAppointments && session) {
      fetchAppointments();
    }
  }, [viewingAppointments, session]);

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date - now;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (appointmentId, newStatus, isSession = false) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      setSuccess(`Appointment status updated to ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentReminder = async (bookingId) => {
    console.log('Payment reminder clicked');
    console.log('Appointment ID:', bookingId);

    const { data, error} = await supabase
    .from('booking_links')
    .select('*')
    .eq('id', bookingId);

    if (error) throw error;

    setBookingData(data);
    console.log('Booking link data:', bookingData[0].token);
  }

  const AppointmentActions = ({ appointment, isSession = false }) => (
    <div className="appointment-actions">
      {appointment.status === 'paid' && (
        <>
          <button
            className="action-btn confirm"
            onClick={() => handleStatusChange(appointment.id, 'approved', isSession)}
          >
            <span className="material-icons">check_circle</span>
            Confirm
          </button>
          <button
            className="action-btn reschedule"
            onClick={() => handleStatusChange(appointment.id, 'reschedule', isSession)}
          >
            <span className="material-icons">schedule</span>
            Request Reschedule
          </button>
        </>
      )}
      {appointment.status === 'scheduled' && (
        <>
          <button
            className="action-btn cancel"
            onClick={() => handleStatusChange(appointment.id, 'cancelled', isSession)}
          >
            <span className="material-icons">cancel</span>
            Cancel
          </button>
          <button
            className="action-btn cancel"
            onClick={() => handlePaymentReminder(appointment.booking_id)}
          >
            <span className="material-icons">payments</span>
            Send Payment Reminder
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="appointments-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">event_busy</span>
          <p>No appointments scheduled</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`appointment-card ${appointment.is_multi_session ? 'multi-session' : ''}`}
            >
              <div className="appointment-header">
                <div className="header-main">
                  <h2>{appointment.client_name}</h2>
                  <div className="header-badges">
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                    <span className={`deposit-badge ${appointment.deposit_paid ? 'paid' : 'unpaid'}`}>
                      Deposit {appointment.deposit_paid ? 'Paid' : 'Unpaid'}
                    </span>
                    {appointment.is_multi_session && (
                      <span className="session-badge">
                        Multiple Sessions
                      </span>
                    )}
                  </div>
                </div>
                <span className="time-badge">
                  Created {calculateTimeAgo(appointment.created_at)}
                </span>
              </div>

              <div className="appointment-content">
                <div className="contact-info">
                  <div className="info-item">
                    <span className="material-icons">email</span>
                    <p>{appointment.client_email}</p>
                  </div>
                  {appointment.client_phone && (
                    <div className="info-item">
                      <span className="material-icons">phone</span>
                      <p>{appointment.client_phone}</p>
                    </div>
                  )}
                </div>

                {appointment.is_multi_session ? (
                  <div className="sessions-container">
                    <h3>Sessions</h3>
                    {appointment.child_sessions?.map((session) => (
                      <div key={session.id} className="session-item">
                        <div className="session-header">
                          <span className="session-number">Session {session.session_number}</span>
                          <span className={`status-badge ${session.status}`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="session-details">
                          <div className="detail-item">
                            <span className="material-icons">event</span>
                            <p>{formatDate(session.date)}</p>
                          </div>
                          <div className="detail-item">
                            <span className="material-icons">schedule</span>
                            <p>{formatTime(session.start_time)} - {formatTime(session.end_time)}</p>
                          </div>
                        </div>
                        <AppointmentActions appointment={session} isSession={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="material-icons">event</span>
                      <p>{formatDate(appointment.date)}</p>
                    </div>
                    <div className="detail-item">
                      <span className="material-icons">schedule</span>
                      <p>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                    </div>
                    {appointment.notes && (
                      <div className="detail-item">
                        <span className="material-icons">note</span>
                        <p>{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!appointment.is_multi_session && (
                <AppointmentActions appointment={appointment} />
              )}
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default ArtistAppointment;