import './Dashboard.css';

import React, { useState } from 'react';
import DashboardHome from './DashboardHome';
import Sidebar from './Sidebar';
import Admin from './Admin';

const Dashboard = ({ artistData, session }) => {
  const [activeTab, setActiveTab] = useState("home");

  if (!artistData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="DashboardContainer">
      <div className="SidebarContainer">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          artistImage={artistData.profile_picture}
          artistName={`${artistData.first_name} ${artistData.last_name}`}
          artistRole={session.user.role}z
        />
      </div>
      <div className="ContentContainer">
        <header className="DashboardHeader">
          <nav className="DashboardNav">

          </nav>
        </header>
        <div className="Content">
          {activeTab === "home" && <DashboardHome artistData={artistData} />}
          {activeTab === "admin" && <Admin />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
