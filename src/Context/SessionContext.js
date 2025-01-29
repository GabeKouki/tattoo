import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Utils/SupabaseClient';
import { useNavigate } from 'react-router-dom';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate(); // Use navigate within the Router context

  useEffect(() => {
    // Fetch the session on mount
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);

      if (data.session) {
        const expiresInMs = (data.session.expires_in || 3600) * 6000; // Default to 6 hours
        const timeout = setTimeout(() => {
          supabase.auth.signOut();
          setSession(null);
          alert('Session has expired. Please log in again.');
          navigate('/login'); // Redirect to login on session expiration
        }, expiresInMs);

        return () => clearTimeout(timeout); // Clear timeout on unmount
      }
    };

    fetchSession();

    // Listen for session changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login'); // Redirect to login when session changes to null
      }
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [navigate]); // Include navigate in the dependency array

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear session context
  };

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
