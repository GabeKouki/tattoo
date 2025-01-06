import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setSession } = useSession(); // Get context setter
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (sessionData.session) {
        setSession(sessionData.session); // Update session context
        navigate('/dashboard');
      } else {
        setError('Login failed. No session found.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
