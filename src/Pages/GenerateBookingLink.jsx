import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../Utils/SupabaseClient';
import { useSession } from '../Context/SessionContext';
import { sendBookingLinkEmail } from '../Utils/EmailUtils';
import './GenerateBookingLink.css';

const GenerateBookingLink = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMultiSession, setIsMultiSession] = useState(false);
  const [sessions, setSessions] = useState([{ duration: '', notes: '' }]);
  const [token, setToken] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inquiryID = location.state?.inquiryID;
  const clientEmail = location.state?.clientEmail;
  const [clientName, setClientName] = useState('');
  const [inquiryData, setInquiryData] = useState([])
  const [artistName, setArtistName] = useState('')

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
    if (!inquiryID || !clientEmail) {
      setError('Invalid booking link generation attempt.');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [session, inquiryID, clientEmail, navigate]);

  const handleGenerateLink = async () => {
    // Validate sessions
    if (isMultiSession) {
      if (sessions.some(session => !session.duration || parseFloat(session.duration) <= 0)) {
        setError('Please specify valid duration for all sessions.');
        return;
      }
    } else {
      if (!sessions[0].duration || parseFloat(sessions[0].duration) <= 0) {
        setError('Please specify a valid appointment duration.');
        return;
      }
    }

    setLoading(true);
    try {
      // Generate unique token
      const newToken = crypto.randomUUID();
      setToken(newToken);

      // Calculate expiration date (7 days from now)
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 7);

      // Format sessions info - ensure it's a proper JSONB array
      const sessionsInfo = isMultiSession ?
        sessions.map((session, index) => ({
          session_number: index + 1,
          duration: parseFloat(session.duration),
          notes: session.notes || null
        })) :
        [{
          session_number: 1,
          duration: parseFloat(sessions[0].duration),
          notes: null
        }];

      const bookingData = {
        artist_id: session.user.id,
        client_email: clientEmail,
        inquiry_id: inquiryID,
        token: newToken,
        duration: parseInt(isMultiSession ?
          sessions.reduce((sum, s) => sum + parseFloat(s.duration), 0) :
          sessions[0].duration
        ),
        is_multi_session: isMultiSession,
        sessions_info: sessionsInfo,
        expiration: expiration.toISOString(),
      };

      console.log('Booking data to be inserted:', bookingData); // Debug log

      const { data, error: dbError } = await supabase
        .from('booking_links')
        .insert([bookingData])
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('Successfully created booking link:', data); // Debug log

      // Generate the public booking link
      const link = `${window.location.origin}/book-appointment/${newToken}`;
      setBookingLink(link);
      setSuccess('Booking link generated successfully!');
    } catch (error) {
      console.error('Error generating booking link:', error);
      setError('Failed to generate booking link. Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!bookingLink || !clientEmail) return;

    //! getting the inquiry data
    try {
      const { data, error } = await supabase.from('inquiries').select('*').eq('id', inquiryID);

      setInquiryData(data);
      setClientName(data[0].client_name);
      if (error) throw error;
    } catch (error) {
      setError('Failed to fetch inquiry data: ' + error.message);
      return
    }


    //! getting the artist name
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', inquiryData[0].artist_id)

      setArtistName(data[0].name)
      if (error) throw error;
    } catch (error) {
      setError('Failed to fetch artist name: ' + error.message);
      return
    }


    setLoading(true);
    try {
      await sendBookingLinkEmail({
        to_email: clientEmail,
        client_name: clientName,  //! Fix me
        artist_name: artistName, //! Fix me
        bookingLink: bookingLink
      });
      setSuccess('Booking link email sent successfully!');
    } catch (error) {
      setError('Failed to send email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1>Generate Booking Link</h1>
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        <div className="client-info">
          <div className="info-group">
            <span className="material-icons">email</span>
            <div>
              <label>Client Email</label>
              <p>{clientEmail}</p>
            </div>
          </div>
        </div>

        <div className="session-type-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isMultiSession}
              onChange={(e) => {
                setIsMultiSession(e.target.checked);
                setSessions([{ duration: '', notes: '' }]);
              }}
            />
            <span>Split into multiple sessions</span>
          </label>
        </div>

        <div className="sessions-container">
          {sessions.map((session, index) => (
            <div key={index} className="session-input">
              <div className="session-header">
                <h3>Session {index + 1}</h3>
                {index > 0 && (
                  <button
                    className="remove-session"
                    onClick={() => setSessions(sessions.filter((_, i) => i !== index))}
                  >
                    <span className="material-icons">remove_circle</span>
                  </button>
                )}
              </div>

              <div className="session-details">
                <div className="input-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    value={session.duration}
                    onChange={(e) => {
                      const newSessions = [...sessions];
                      newSessions[index].duration = e.target.value;
                      setSessions(newSessions);
                    }}
                    min="0.5"
                    step="0.5"
                    placeholder="Enter duration in hours"
                  />
                </div>

                <div className="input-group">
                  <label>Session Notes (Optional)</label>
                  <textarea
                    value={session.notes}
                    onChange={(e) => {
                      const newSessions = [...sessions];
                      newSessions[index].notes = e.target.value;
                      setSessions(newSessions);
                    }}
                    placeholder="Add any specific notes for this session"
                  />
                </div>
              </div>
            </div>
          ))}

          {isMultiSession && sessions.length < 5 && (
            <button className="add-session" onClick={() => setSessions([...sessions, { duration: '', notes: '' }])}>
              <span className="material-icons">add_circle</span>
              Add Session
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!bookingLink ? (
          <button
            className="generate-button"
            onClick={handleGenerateLink}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons spinning">sync</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-icons">link</span>
                Generate Booking Link
              </>
            )}
          </button>
        ) : (
          <div className="booking-link-section">
            <div className="link-display">
              <label>Booking Link:</label>
              <div className="link-container">
                <input type="text" value={bookingLink} readOnly />
                <button
                  onClick={() => navigator.clipboard.writeText(bookingLink)}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
            </div>
            <button
              className="send-email-button"
              onClick={handleSendEmail}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-icons spinning">sync</span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-icons">send</span>
                  Send Email to Client
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateBookingLink;