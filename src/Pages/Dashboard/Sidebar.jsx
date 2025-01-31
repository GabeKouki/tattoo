import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaArrowRight,
  FaHome,
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarAlt,
  FaUsersCog,
  FaPaperPlane,
  FaCog,
} from "react-icons/fa";
import ProfilePicture from "../../Images/Audrey.jpeg";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("home");

  const handleSidebarClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`SidebarContainer ${sidebarOpen ? "open" : ""}`}>
      <div className="SidebarHeading">
        {sidebarOpen && <h1 className="LogoText">Above The Clouds</h1>}
        <FaArrowRight
          className={`ToggleIcon ${sidebarOpen ? "rotate" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div className="SidebarBody">
        {!sidebarOpen && <div className="Separator"></div>}

        {sidebarOpen && <h2 className="GroupTitle">Main Menu</h2>}
        <div className="MainGroup">
          <div
            className={`MenuItem ${activeTab === "home" ? "active" : ""} ${sidebarOpen ? "expanded" : ""}`}
            onClick={() => handleSidebarClick("home")}
          >
            <FaHome className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Dashboard</span>}
          </div>
          <div
            className={`MenuItem ${
              activeTab === "appointments" ? "active" : ""
            }`}
            onClick={() => handleSidebarClick("appointments")}
          >
            <FaCalendarCheck className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Appointments</span>}
          </div>
          <div
            className={`MenuItem ${
              activeTab === "addAppointment" ? "active" : ""
            }`}
            onClick={() => handleSidebarClick("addAppointment")}
          >
            <FaCalendarPlus className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">New Appointment</span>}
          </div>
        </div>

        {!sidebarOpen && <div className="Separator"></div>}

        {sidebarOpen && <h2 className="GroupTitle">General</h2>}
        <div className="GeneralGroup">
          <div
            className={`MenuItem ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => handleSidebarClick("calendar")}
          >
            <FaCalendarAlt className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Calendar</span>}
          </div>
          <div
            className={`MenuItem ${
              activeTab === "manageArtists" ? "active" : ""
            }`}
            onClick={() => handleSidebarClick("manageArtists")}
          >
            <FaUsersCog className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Manage Artists</span>}
          </div>
          <div
            className={`MenuItem ${activeTab === "sendEmail" ? "active" : ""}`}
            onClick={() => handleSidebarClick("sendEmail")}
          >
            <FaPaperPlane className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Send Email</span>}
          </div>
        </div>

        {!sidebarOpen && <div className="Separator"></div>}

        {sidebarOpen && <h2 className="GroupTitle">Account</h2>}
        <div className="AccountGroup">
          <div
            className={`MenuItem ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => handleSidebarClick("settings")}
          >
            <FaCog className="SidebarIcon" />
            {sidebarOpen && <span className="MenuText">Settings</span>}
          </div>
        </div>
      </div>

      <div className="SidebarFooter">
        <div className={`ProfileSection ${sidebarOpen ? "expanded" : ""}`}>
          <img
            src={ProfilePicture}
            alt="UserProfile"
            className="ProfilePicture"
          />
          {sidebarOpen && (
            <div className="ProfileInfo">
              <h3 className="ProfileName">Eva Murphy</h3>
              <p className="ProfileRole">Web Developer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
