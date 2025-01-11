import React, { useState, useEffect } from 'react';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { useNavigate } from 'react-router-dom';
import './ManageAccount.css';

const ManageAccount = () => {
  const { session } = useSession();
  const [profile, setProfile] = useState({ name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session || !session.user) {
          throw new Error('User session not available.');
        }

        const { data, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile({
          name: data.name || '',
          phone: data.phone || '',
          password: '',
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchUserData();
  }, [session]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const updates = {
        name: profile.name,
        phone: profile.phone,
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      if (profile.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: profile.password,
        });

        if (passwordError) {
          throw passwordError;
        }
      }

      setMessage('Profile updated successfully!');
      navigate('/dashboard')
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="content-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <span className="material-icons">arrow_back</span>
          Back to Dashboard
        </button>
      </div>
      <h1>Edit Profile</h1>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Enter your name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          value={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          placeholder="Enter a new password"
        />
      </div>
      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className="update-button"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ManageAccount;