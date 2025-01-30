import React, { useEffect, useState } from 'react';
import { FiEdit, FiCalendar, FiClock, FiUser, FiMail, FiPlus } from 'react-icons/fi';
import { fetchArtistData, fetchAppointments, fetchAvailability, fetchTestimonials } from '../../Utils/dashboardUtils';
import { supabase } from "../../Utils/SupabaseClient"
import './Dashboard.css';

const Dashboard = ({ user, session }) => {
  const [artistData, setArtistData] = useState(null);
  // const [appointments, setAppointments] = useState([]);
  // const [availability, setAvailability] = useState([]);
  // const [testimonials, setTestimonials] = useState([]);

  //! fetching all the artist Data from the artists table
  const fetchArtistData = async (artistEmail) => {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('email', artistEmail)
      .single();

    if (error) {
      throw error;
    }
    setArtistData(data);
  };

//! on mount, fetch the artist data
  useEffect(() => {
    fetchArtistData(session.user.email)
  }, [session]);


  if (!artistData) return <div className="loading">Loading...</div>;

  return (
    <div className="DashboardContainer">
      <div className="DashboardContainer">
        
      </div>
    </div>
  );
};

export default Dashboard;