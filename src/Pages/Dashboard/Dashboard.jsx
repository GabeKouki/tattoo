import React, { useEffect, useState } from 'react';
import { fetchArtistData } from '../../Utils/dashboardUtils';
import ManageArtists from './ManageArtists';
import './Dashboard.css';
import Sidebar from './Sidebar';

const Dashboard = ({ user, session }) => {
  const [artistData, setArtistData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");


  useEffect(() => {
    setArtistData(fetchArtistData(session.user.email))
    setActiveTab(activeTab)
  }, [session, activeTab]);


  if (!artistData) return <div className="loading">Loading...</div>;

  return (
    <>
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      artistName={(artistData.first_name + ' ' + artistData.last_name)}
      artistRole={session.user.role}
      artistimage={artistData.profile_picture}
      />

    {activeTab === "manageArtists" && <ManageArtists />}

    </>
  );
};

export default Dashboard;