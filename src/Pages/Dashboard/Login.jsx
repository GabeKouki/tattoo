import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import './Login.css'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setSession } = useSession();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Authenticate with auth.users
      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (sessionError || !sessionData.session) {
        throw new Error('Invalid email or password.');
      }

      const userId = sessionData.user.id;

      // Fetch role and metadata from users table
      const { data: userMetadata, error: metadataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (metadataError || !userMetadata) {
        throw new Error('Unable to fetch user metadata.');
      }

      // Set session and metadata
      setSession({ ...sessionData.session, userMetadata });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Artist Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="material-icons">email</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="material-icons">lock</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">
            <span className="material-icons">error</span>
            {error}
          </div>}

          <div className="button-group">
            <button type="submit" className="login-button">
              <span className="material-icons">login</span>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
