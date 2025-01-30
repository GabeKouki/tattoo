import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaArrowRight,
  FaCog,
  FaHome,
  FaUsersCog,
  FaPlus,
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";
import ProfilePicture from "../../Images/Audrey.jpeg";

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage }) => {
  const [activeTab, setActiveTab] = useState("home");

  const handleSidebarClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`SidebarContainer ${sidebarOpen ? "open" : ""}`}>
      <div className="SidebarHeading">
        <FaArrowRight
          className="SidebarIcon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        {sidebarOpen && <h1>Above The Clouds</h1>}
      </div>
      <div className="SidebarBody">
        <div className={`MainGroup ${sidebarOpen ? "open" : ""}`}>
          <span className="Separator" />
          <span>
            <FaHome
              className={`SidebarIcon ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleSidebarClick("home")}
            />
          </span>
          <span>
            <FaCalendarCheck
              className={`SidebarIcon ${
                activeTab === "appointments" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("appointments")}
            />
          </span>
          <span>
            <FaCalendarPlus
              className={`SidebarIcon ${
                activeTab === "addAppointment" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("addAppointment")}
            />
          </span>
        </div>
        <div className="GeneralGroup">
          <span className="Separator" />
          <span>
            <FaCalendarAlt
              className={`SidebarIcon ${
                activeTab === "calendar" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("calendar")}
            />
          </span>
          <span>
            <FaUsersCog
              className={`SidebarIcon ${
                activeTab === "manageArtists" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("manageArtists")}
            />
          </span>
          <span>
            <FaPaperPlane
              className={`SidebarIcon ${
                activeTab === "sendEmail" ? "active" : ""
              }`}
            onClick={() => handleSidebarClick("sendEmail")}
            />
          </span>
        </div>
      </div>
      <div className="SidebarFooter">
        <span className="Separator" />
        <span>
          <FaCog
            className={`SidebarIcon ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => handleSidebarClick("settings")}
          />
        </span>
        <img src={ProfilePicture} alt="Audrey" className="ProfilePicture" />
      </div>
    </div>
  );
};

export default Sidebar;
