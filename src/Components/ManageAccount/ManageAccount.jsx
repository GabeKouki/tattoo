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
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      setIsEditing(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-account-container">
      <div className="manage-account-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <span className="material-icons">arrow_back</span>
          Back to Dashboard
        </button>
        <h1>Account Settings</h1>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="material-icons">account_circle</span>
            <h2>{profile.name || 'Artist'}</h2>
          </div>
          <button 
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="material-icons">
              {isEditing ? 'close' : 'edit'}
            </span>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="form-group">
            <label>
              <span className="material-icons">badge</span>
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="material-icons">phone</span>
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          {isEditing && (
            <div className="form-group">
              <label>
                <span className="material-icons">lock</span>
                New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-icons">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {message && <div className="message success">{message}</div>}
          {error && <div className="message error">{error}</div>}

          {isEditing && (
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="update-button"
            >
              {loading ? (
                <>
                  <span className="material-icons spinning">sync</span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="material-icons">save</span>
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;