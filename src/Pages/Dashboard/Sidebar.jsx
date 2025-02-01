import React, { useState } from "react";
import profilePicture from "../../Images/Audrey.jpeg";
import logout from "../../Images/logout.png";
import dashboard from "../../Images/dashboard.png";
import calendar from "../../Images/calendar.png";
import calendar2 from "../../Images/calendar2.png";
import downarrow from "../../Images/downarrow.png";
import user from "../../Images/user.png";
import padlock from "../../Images/padlock.png";
import "./Sidebar.css";

const Sidebar = ({ artistImage, artistName, artistRole }) => {
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const toggleAppointments = () => {
    setAppointmentsOpen((prev) => !prev);
  };

  const toggleSchedule = () => {
    setScheduleOpen((prev) => !prev);
  };
  return (
    <>
      <h2>Above The Clouds</h2>
      <div className="SidebarButtonContainer">
        <div className="SideNavItem">
          <img src={dashboard} alt="Dashboard Icon" className="DashboardIcon" />
          <h3>Dashboard</h3>
        </div>

        <div className="SideNavWrapper">
          <div className={`SideNavItem ${appointmentsOpen ? "active" : ""}`} onClick={toggleAppointments}>
            <img src={calendar} alt="Appointments" className="DashboardIcon" />
            <h3>Appointments</h3>
            <img src={downarrow} alt="down arrow" className="DownArrow" />
          </div>
          <div
            className={`DropDownContent ${appointmentsOpen ? "active" : ""}`}
          >
            <div className="SideNavItem">
              <h3>Need Action</h3>
            </div>
            <div className="SideNavItem">
              <h3>Add Appointment</h3>
            </div>
          </div>
        </div>

        <div className="SideNavWrapper">
          <div className={`SideNavItem ${scheduleOpen ? "active" : ""}`} onClick={toggleSchedule}>
            <img src={calendar2} alt="Schedule" className="DashboardIcon" />
            <h3>Schedule</h3>
            <img src={downarrow} alt="down arrow" className="DownArrow" />
          </div>
          <div className={`DropDownContent ${scheduleOpen ? "active" : ""}`}>
            <div className="SideNavItem">
              <h3>View Schedule</h3>
            </div>
            <div className="SideNavItem">
              <h3>Change Hours</h3>
            </div>
            <div className="SideNavItem">
              <h3>Time Off</h3>
            </div>
          </div>
        </div>

        <div className="SideNavItem">
          <img src={user} alt="Profile Icon" className="DashboardIcon" />
          <h3>Profile</h3>
        </div>
        <div className="SideNavItem">
          <img src={padlock} alt="Admin Icon" className="DashboardIcon" />
          <h3>Admin+</h3>
        </div>
      </div>

      <div className="SidebarFooter">
        <img src={artistImage} alt="Audrey" className="ProfilePicture" />
        <span className="FooterText">
          <h4>{artistName}</h4>
          <h4>
            <strong>{artistRole}</strong>
          </h4>
        </span>
        <img src={logout} alt="logout" className="LogoutIcon" />
      </div>
    </>
  );
};

export default Sidebar;
