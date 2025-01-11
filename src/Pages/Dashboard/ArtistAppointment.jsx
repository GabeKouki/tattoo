import './Dashboard.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';

const ArtistAppointment = ({ viewingAppointments, setViewingAppointments }) => {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase.from('appointments').select('*').order('created_at', { ascending: true });

      if (session.user.app_metadata.role !== 'admin') {
        query = query.eq('artist_id', session.user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Fetched appointments:', data); // Debug fetched inquiries
      setAppointments(data);
      setViewingAppointments(true);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };
  
  // Only fetch appointments when viewingAppointments becomes true
  useEffect(() => {
    if (viewingAppointments && session) {
      fetchAppointments();
    }
  }, [viewingAppointments, session]);

  return (
    <div className="content-container">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="content-grid">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">event_busy</span>
            <p>No appointments found</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div className="card appointment-card" key={appointment.id}>
              <div className="card-header">
                <h2>{appointment.client_name}</h2>
                <p>{appointment.status}</p>
                <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
              </div>

              <div className="card-content">
                <div className="info-group">
                  <span className="material-icons">email</span>
                  <p>{appointment.client_email}</p>
                </div>

                <div className="info-group">
                  <span className="material-icons">event</span>
                  <p>{new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>

              <div className="card-actions">
                <button className="action-btn reschedule">
                  <span className="material-icons">schedule</span>
                  Reschedule
                </button>
                <button className="action-btn cancel">
                  <span className="material-icons">cancel</span>
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtistAppointment;