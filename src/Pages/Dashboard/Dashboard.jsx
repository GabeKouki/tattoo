import React, { useEffect, useState } from 'react';
import { fetchArtistData } from '../../Utils/dashboardUtils';
import './Dashboard.css';
import Sidebar from './Sidebar';

const Dashboard = ({ artistData, session }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  if (!artistData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="DashboardContainer">
      <div className="SidebarContainer">
        <Sidebar 
          artistImage={artistData.profile_picture}
          artistName={`${artistData.first_name} ${artistData.last_name}`}
          artistRole={session.user.role}
        />
      </div>
      <div className="ContentContainer">
        <header className="DashboardHeader">
          <nav className="DashboardNav">
            {/* Navigation content goes here */}
          </nav>
        </header>
        <div className="Content">
          {/* Main content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
