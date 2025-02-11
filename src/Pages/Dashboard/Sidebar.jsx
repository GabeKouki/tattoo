import React from "react";
import logout from "../../Images/logout.png";
import dashboard from "../../Images/dashboard.png";
import calendar from "../../Images/calendar.png";
import calendar2 from "../../Images/calendar2.png";
import downarrow from "../../Images/downarrow.png";
import user from "../../Images/user.png";
import padlock from "../../Images/padlock.png";
import { logoutUser } from "../../Utils/dashboardUtils";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ artistImage, artistName, artistRole, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { data, error } = await logoutUser();
    if (error) {
      console.log(error);
      throw error;
    }
    navigate("/");
    setActiveTab("home");
    return data;
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <h2>Above The Clouds</h2>
      <div className="SidebarButtonContainer">
        <div className="SideNavItem" onClick={() => handleTabClick("home")}>
          <img src={dashboard} alt="Dashboard Icon" className="DashboardIcon" />
          <h3>Dashboard</h3>
        </div>

        <div className="SideNavWrapper">
          <div
            className={`SideNavItem ${
              activeTab === "appointments" ? "active" : ""
            }`}
          >
            <img src={calendar} alt="Appointments" className="DashboardIcon" />
            <h3>Appointments</h3>
            <img src={downarrow} alt="down arrow" className="DownArrow" />
          </div>
          <div
            className={`DropDownContent ${
              activeTab === "appointments" ? "active" : ""
            }`}
          >
            <div className="SideNavItem" onClick={() =>handleTabClick("needAction")}>
              <h3>Need Action</h3>
            </div>
            <div className="SideNavItem" onClick={() =>handleTabClick("addAppointment")}>
              <h3>Add Appointment</h3>
            </div>
          </div>
        </div>

        <div className="SideNavWrapper">
          <div
            className={`SideNavItem ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => handleTabClick("schedule")}
          >
            <img src={calendar2} alt="Schedule" className="DashboardIcon" />
            <h3>Schedule</h3>
            <img src={downarrow} alt="down arrow" className="DownArrow" />
          </div>
          <div
            className={`DropDownContent ${
              activeTab === "schedule" ? "active" : ""
            }`}
          >
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
        <div className="SideNavItem" onClick={() => handleTabClick("admin")}>
          <img src={padlock} alt="Admin Icon" className="DashboardIcon"  />
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
        <img onClick={() => handleLogout()} src={logout} alt="logout" className="LogoutIcon" />
      </div>
    </>
  );
};

export default Sidebar;
