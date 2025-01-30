import React, { useEffect, useState } from 'react';
import './AddAppointment.css'
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { insertAppointment } from '../../Utils/AppointmentUtils';

const timeStringToDate = (timeString, baseDate) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date(baseDate);
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  return date;
};

const formatTimeString = (date) => {
  return date.toTimeString().substring(0, 5);
};


const AddAppointment = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [artistMapping, setArtistMapping] = useState({});
  const [artistFilter, setArtistFilter] = useState('all');
  const [isMultiSession, setIsMultiSession] = useState(false);
  const [sessions, setSessions] = useState([{
    duration: '',
    notes: '',
    start_time: null,
    end_time: null
  }]);

  const [appointmentDetails, setAppointmentDetails] = useState({
    artist_id: null,
    artist_name: null,
    client_name: '',
    client_email: '',
    client_phone: '',
    date: '',
    deposit_paid: false,
    notes: '',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_multi_session: false,
    session_number: null,
    parent_appointment_id: null,
    booking_id: null
  });

  const fetchArtistMapping = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name');

      if (error) throw error;

      const mapping = {};
      data.forEach((artist) => {
        mapping[artist.id] = artist.name;
      });
      setArtistMapping(mapping);
    } catch (err) {
      console.error('Error fetching artist mapping:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!session) {
      navigate('/login');
    }

    fetchArtistMapping();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSessionChange = (index, field, value) => {
    const newSessions = [...sessions];
    newSessions[index] = {
      ...newSessions[index],
      [field]: value
    };
    
    // Calculate end time if duration changes
    if (field === 'duration' || field === 'start_time') {
      if (newSessions[index].start_time && value) {
        const startTime = new Date(`2000/01/01 ${newSessions[index].start_time}`);
        const endTime = new Date(startTime.getTime() + (parseFloat(value) * 60 * 60 * 1000));
        newSessions[index].end_time = endTime.toTimeString().slice(0, 5);
      }
    }
    
    setSessions(newSessions);
  };


  const handleArtistChange = (e) => {
    const selectedValue = e.target.value;
    setArtistFilter(selectedValue);
    setAppointmentDetails(prev => ({
      ...prev,
      artist_id: selectedValue === 'all' ? null : selectedValue,
      artist_name: selectedValue === 'all' ? null : artistMapping[selectedValue]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!appointmentDetails.artist_id) {
        alert('Please select an artist');
        return;
      }

      if (isMultiSession) {
        // Create parent appointment
        const parentAppointment = {
          ...appointmentDetails,
          is_multi_session: true,
          duration: sessions.reduce((total, session) => total + parseFloat(session.duration), 0)
        };

        const { data: parentData, error: parentError } = await supabase
          .from('appointments')
          .insert([parentAppointment])
          .select()
          .single();

        if (parentError) throw parentError;

        // Create child appointments
        const childAppointments = sessions.map((session, index) => ({
          ...appointmentDetails,
          start_time: session.start_time,
          end_time: session.end_time,
          duration: parseFloat(session.duration),
          notes: session.notes,
          is_multi_session: true,
          session_number: index + 1,
          parent_appointment_id: parentData.id
        }));

        const { error: childError } = await supabase
          .from('appointments')
          .insert(childAppointments);

        if (childError) throw childError;
      } else {
        // Single session appointment
        await insertAppointment({
          ...appointmentDetails,
          ...sessions[0]
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };


  return (
    <div className="add-appointment-container">
      <div className="appointment-card">
        <h1>Add Appointment</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Artist:
              <select
                value={artistFilter}
                onChange={handleArtistChange}
                className="artist-select"
                required
              >
                <option value="all">Select Artist</option>
                {Object.entries(artistMapping).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Client Name:
              <input
                type="text"
                name="client_name"
                value={appointmentDetails.client_name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Client Email:
              <input
                type="email"
                name="client_email"
                value={appointmentDetails.client_email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Client Phone:
              <input
                type="tel"
                name="client_phone"
                value={appointmentDetails.client_phone}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isMultiSession}
                onChange={(e) => {
                  setIsMultiSession(e.target.checked);
                  if (!e.target.checked) {
                    setSessions([{ duration: '', notes: '', start_time: null, end_time: null }]);
                  }
                }}
              />
              Split into multiple sessions
            </label>
          </div>

          {sessions.map((session, index) => (
            <div key={index} className="session-container">
              <h3>Session {index + 1}</h3>
              
              <div className="form-group">
                <label>
                  Duration (hours):
                  <input
                    type="number"
                    value={session.duration}
                    onChange={(e) => handleSessionChange(index, 'duration', e.target.value)}
                    min="0.5"
                    step="0.5"
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  Start Time:
                  <input
                    type="time"
                    value={session.start_time || ''}
                    onChange={(e) => handleSessionChange(index, 'start_time', e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  End Time:
                  <input
                    type="time"
                    value={session.end_time || ''}
                    disabled
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  Notes:
                  <textarea
                    value={session.notes}
                    onChange={(e) => handleSessionChange(index, 'notes', e.target.value)}
                  />
                </label>
              </div>

              {isMultiSession && sessions.length > 1 && (
                <button
                  type="button"
                  className="remove-session"
                  onClick={() => {
                    const newSessions = sessions.filter((_, i) => i !== index);
                    setSessions(newSessions);
                  }}
                >
                  Remove Session
                </button>
              )}
            </div>
          ))}

          {isMultiSession && sessions.length < 5 && (
            <button
              type="button"
              className="add-session"
              onClick={() => setSessions([...sessions, { duration: '', notes: '', start_time: null, end_time: null }])}
            >
              Add Session
            </button>
          )}

          <button type="submit" className="submit-button">
            Create Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
