import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../Utils/SupabaseClient';
import { useSession } from '../Context/SessionContext';
import './GenerateBookingLink.css';

const GenerateBookingLink = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [duration, setDuration] = useState('');
  const [token, setToken] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [loading, setLoading] = useState(false);

  const inquiryID = location.state?.inquiryID;
  const clientEmail = location.state?.clientEmail;

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
    if (!inquiryID || !clientEmail) {
      alert('Invalid booking link generation attempt.');
      navigate('/dashboard');
    }
  }, [session, inquiryID, clientEmail, navigate]);

  const handleGenerateLink = async () => {
    if (!duration) {
      alert('Please specify the appointment duration.');
      return;
    }

    setLoading(true);
    try {
      // Generate unique token
      const newToken = crypto.randomUUID();
      setToken(newToken);

      // Calculate expiration date (7 days from now)
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 7);

      // Save the booking link in the database
      const { error } = await supabase.from('booking_links').insert([
        {
          artist_id: session.user.id,
          client_email: clientEmail,
          token: newToken,
          duration: parseInt(duration, 10),
          expiration: expiration.toISOString(),
        },
      ]);

      if (error) throw error;

      // Generate the public booking link
      const link = `${window.location.origin}/book-appointment/${newToken}`;
      setBookingLink(link);
    } catch (error) {
      console.error('Error generating booking link:', error);
      alert('Failed to generate booking link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="GenerateBookingLink">
      <h1>Generate Booking Link</h1>
      <p>Client Email: {clientEmail}</p>
      <p>Inquiry ID: {inquiryID}</p>

      <div className="form-group">
        <label htmlFor="duration">Appointment Duration (hours):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
          placeholder="Enter duration in hours"
        />
      </div>

      <button onClick={handleGenerateLink} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Booking Link'}
      </button>

      {bookingLink && (
        <div className="BookingLink">
          <p>Booking Link Generated:</p>
          <a href={bookingLink} target="_blank" rel="noopener noreferrer">
            {bookingLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default GenerateBookingLink;
