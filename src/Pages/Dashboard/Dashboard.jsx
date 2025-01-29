import React, { useEffect, useState } from 'react';
import { FiEdit, FiCalendar, FiClock, FiUser, FiMail, FiPlus } from 'react-icons/fi';
import { fetchArtistData, fetchAppointments, fetchAvailability, fetchTestimonials } from '../../Utils/dashboardUtils';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [artistData, setArtistData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    const loadData = async () => {
      try {
        const artistRes = await fetchArtistData(user.email);
        const appsRes = await fetchAppointments(user.id);
        const availRes = await fetchAvailability(user.id);
        const testRes = await fetchTestimonials(user.id);

        if (artistRes.data) setArtistData(artistRes.data);
        if (appsRes.data) setAppointments(appsRes.data);
        if (availRes.data) setAvailability(availRes.data);
        if (testRes.data) setTestimonials(testRes.data);
      } catch (error) {
        console.error('Dashboard data error:', error);
      }
    };

    if (user) loadData();
  }, [user]);

  if (!artistData) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-main">
          <div className="header-content">
            <h1>Welcome, {artistData.first_name}!</h1>
            <button className="button-primary">
              <FiEdit /> Edit Profile
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="grid-layout">
          {/* Profile Section */}
          <div className="profile-card">
            <img
              src={artistData.profile_picture || '/default-avatar.png'}
              className="profile-image"
              alt="Profile"
            />
            <h2>{artistData.first_name} {artistData.last_name}</h2>
            <p className="bio">{artistData.bio}</p>
            
            <div className="profile-info">
              <div className="info-item">
                <FiMail /> {artistData.email}
              </div>
              <div className="info-item">
                <FiUser /> {artistData.experience_in_years} years experience
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="tabs-container">
              {['appointments', 'availability', 'testimonials'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="content-card">
                <div className="card-header">
                  <h3>Upcoming Appointments</h3>
                  <button className="button-primary">
                    <FiPlus /> New Appointment
                  </button>
                </div>
                
                <div className="appointments-list">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-header">
                        <h4>{appointment.client_name}</h4>
                        <span className={`status-badge ${
                          appointment.status === 'confirmed' 
                            ? 'status-confirmed' 
                            : 'status-pending'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p>{appointment.tattoo_description}</p>
                      <div className="appointment-time">
                        <FiCalendar /> {new Date(appointment.appointment_date).toLocaleDateString()}
                        <FiClock /> {appointment.start_time} - {appointment.end_time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="content-card">
                <h3>Weekly Schedule</h3>
                <div className="availability-grid">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                    const dayAvailability = availability.find(a => a.day_of_week === day);
                    return (
                      <div key={day} className="availability-day">
                        <h4>{day}</h4>
                        {dayAvailability?.is_available ? (
                          <div className="available-time">
                            {dayAvailability.start_time} - {dayAvailability.end_time}
                          </div>
                        ) : (
                          <div className="unavailable">Unavailable</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="content-card">
                <div className="card-header">
                  <h3>Client Testimonials</h3>
                  <button className="button-primary">
                    <FiPlus /> Request Testimonial
                  </button>
                </div>
                
                <div className="testimonials-list">
                  {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="testimonial-item">
                      <p>"{testimonial.message}"</p>
                      <div className="testimonial-date">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;