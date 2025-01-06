import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Utils/SupabaseClient';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the session on mount
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
    };

    fetchSession();

    // Listen for session changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe?.(); // Safely unsubscribe
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
