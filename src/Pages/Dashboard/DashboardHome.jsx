import React, { useEffect, useState } from "react";
import { fetchAppointmentsByArtistId } from "../../Utils/dashboardUtils";
import "./DashboardHome.css";

const DashboardHome = ({ artistData }) => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const [appointmentData, setAppointmentData] = useState([]);
  const appointments = appointmentData.filter(
    (appointment) =>
      appointment.appointment_date === formattedDate &&
      appointment.status === "appointmentConfirmed"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAppointmentsByArtistId(artistData.id);
        setAppointmentData(data);
        console.log("Fetched Appointments:", data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    if (artistData?.id) {
      fetchData();
    }
  }, [artistData]);

  const getQuickStats = () => {
    const todaysAppointments = appointmentData.filter(
      (appointment) =>
        appointment.appointment_date === formattedDate &&
        appointment.status === "appointmentConfirmed"
    ).length;
    const pendingInquiries = appointmentData.filter(
      (appointment) => appointment.status === "inquiryPending"
    ).length;
    const pendingConfirmations = appointmentData.filter(
      (appointment) => appointment.status === "appointmentPending"
    ).length;
    const cancellations = appointmentData.filter(
      (appointment) =>
        appointment.appointment_date === formattedDate &&
        appointment.status === "cancelled"
    ).length;

    return [
      { label: "Today's Appointments", value: todaysAppointments },
      { label: "Pending Inquiries", value: pendingInquiries },
      { label: "Pending Confirmations", value: pendingConfirmations },
      { label: "Today's Cancellations", value: cancellations },
    ];
  };

  const quickStats = getQuickStats();

  return (
    <div className="DashboardHomeContainer">
      <div className="DashboardHomeHeader">
        <h1>Welcome back {artistData.first_name}!</h1>
        <div className="QuickStatsContainer">
          {quickStats.map((stat) => (
            <div className="QuickStat" key={stat.label}>
              <span>
                <h3>{stat.label}</h3>
                <h3><strong>{stat.value}</strong></h3>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="DashboardHomeBody">
        <h1>Quick Actions</h1>
        <div className="DashboardHomeBodyButtonContainer">
          <button>Create New Appointment</button>
          <button>View Full Schedule</button>
          <button>Manage Inquiries</button>
        </div>
        <div className="DashboardHomeAppointmentsContainer">
          <div className="AppointmentsContainerHeader">
            <h1>Today's Appointments</h1>
            <span>View All</span>
          </div>
          <div className="AppointmentsContainerBody">
            {appointments.map((appointment) => {
              return (
                <>
                  <span>{appointment.start_time}</span>
                  <div className="AppointmentBody">
                    <h1>{appointment.client_name}</h1>
                    <p>{appointment.tattoo_description}</p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div className="DashboardHomePendingInquiries">
          <h1>Pending Inquiries</h1>
          <div className="PendingInquiriesContainer">
            {appointmentData.filter(
              (appointment) => appointment.status === "inquiryPending"
            ).map((appointment) => {
              return (
                <div className="PendingInquiry" key={appointment.id}>
                  <h1>{appointment.client_name}</h1>
                  <p>{appointment.tattoo_description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
