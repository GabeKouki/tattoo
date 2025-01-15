import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { sendRejectionEmail } from '../../Utils/EmailUtils';
import './Dashboard.css';
import ArtistSchedule from './ArtistSchedule';
import ArtistAppointment from './ArtistAppointment';

const Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [viewingInquiries, setViewingInquiries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewingAppointments, setViewingAppointments] = useState(false);
  const [viewingSchedule, setViewingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [artistMapping, setArtistMapping] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    pendingInquiries: 0,
    todayAppointments: 0,
    weeklyAppointments: 0
  });
  const [inquiryFilter, setInquiryFilter] = useState('pending');

  useEffect(() => {
    const fetchArtistMapping = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name');

        if (error) throw error;

        const mapping = {};
        data.forEach((artist) => {
          mapping[artist.id] = artist.name;
        });
        setArtistMapping(mapping);
      } catch (err) {
        console.error('Error fetching artist mapping:', err);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        // Get total appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('artist_id', session.user.id)
          .gte('session_number', 0);

        // Get pending inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('inquiries')
          .select('*')
          .eq('artist_id', session.user.id)
          .eq('status', 'pending');

        if (appointmentsError || inquiriesError) throw new Error('Error fetching stats');

        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointmentsData.filter(apt =>
          apt.date.startsWith(today) && apt.parent_appointment_id !== null
        ).length;

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weeklyAppts = appointmentsData.filter(apt =>
          new Date(apt.date) >= weekStart && apt.parent_appointment_id !== null
        ).length;

        setDashboardStats({
          totalAppointments: appointmentsData.length,
          pendingInquiries: inquiriesData.length,
          todayAppointments: todayAppts,
          weeklyAppointments: weeklyAppts
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchArtistMapping();
    fetchDashboardStats();

    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (viewingInquiries) {
      fetchInquiries();
    }
  }, [inquiryFilter, viewingInquiries]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('artist_id', session.user.id)
        .not('booking_id', 'is', null) // Exclude rows where booking_id is null
        .order('date', { ascending: true });

      if (error) throw error;

      setSchedule(data);
      setViewingSchedule(true);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      alert('Failed to fetch schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          artist:artist_id(name)
        `)
        .order('created_at', { ascending: false }); // Changed to show newest first

      if (session.user.app_metadata.role !== 'admin') {
        query = query.eq('artist_id', session.user.id);
      }

      if (inquiryFilter !== 'all') {
        query = query.eq('status', inquiryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setInquiries(data);
      setViewingInquiries(true);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      alert('Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (inquiry) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', inquiry.id);

      if (error) {
        alert('Failed to delete inquiry.');
        return;
      }

      alert('Inquiry deleted successfully.');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry.');
    }

    fetchInquiries();
  };

  const handleAccept = async (inquiry) => {

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'accepted' })
        .eq('id', inquiry.id);

      if (error) throw error;

      navigate(`/generate-booking-link/${inquiry.id}/${encodeURIComponent(inquiry.client_email)}`, {
        state: { inquiryID: inquiry.id, clientEmail: inquiry.client_email },
      });
    } catch (err) {
      console.error('Error accepting inquiry:', err);
      alert('Failed to accept inquiry.');
    }
  };

  const handleReject = async (inquiry) => {
    const reasonDialog = document.createElement('dialog');
    reasonDialog.className = 'rejection-dialog';
    reasonDialog.innerHTML = `
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>Reject Inquiry</h3>
          <button class="close-button" id="cancel-reject">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="dialog-body">
          <p>Please provide a reason for rejecting this inquiry:</p>
          <textarea 
            id="rejection-reason" 
            placeholder="Enter rejection reason..."
          ></textarea>
        </div>
        <div class="dialog-actions">
          <button id="confirm-reject">
            <span class="material-icons">cancel</span>
            Reject Inquiry
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(reasonDialog);
    reasonDialog.showModal();

    const cancelButton = reasonDialog.querySelector('#cancel-reject');
    const confirmButton = reasonDialog.querySelector('#confirm-reject');
    const reasonText = reasonDialog.querySelector('#rejection-reason');

    cancelButton.onclick = () => {
      reasonDialog.close();
      document.body.removeChild(reasonDialog);
    };

    confirmButton.onclick = async () => {
      const reason = reasonText.value.trim();
      if (!reason) {
        alert('Please provide a reason for rejection');
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({
            status: 'rejected',
            rejection_reason: reason
          })
          .eq('id', inquiry.id);

        if (error) throw error;

        await sendRejectionEmail({
          clientEmail: inquiry.client_email,
          clientName: inquiry.client_name,
          rejectionReason: reason,
          artistName: session?.user.user_metadata.name || 'The Artist',
        });

        alert(`Inquiry from ${inquiry.client_name} has been rejected and notification email sent.`);
      } catch (err) {
        console.error('Error in rejection process:', err);
        alert('Failed to process rejection. Please try again.');
      } finally {
        setLoading(false);
        reasonDialog.close();
        document.body.removeChild(reasonDialog);
        fetchInquiries();
      }
    };

    reasonDialog.addEventListener('close', () => {
      if (document.body.contains(reasonDialog)) {
        document.body.removeChild(reasonDialog);
      }
    });
  };

  const handleTest = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw new Error('Failed to fetch user name.');
      }

      console.log('Fetched User Name:', data.name);
    } catch (err) {
      console.error('Error fetching user data:', err);
      alert('Failed to fetch user data.');
    }

    console.log('Test function called');
    console.log('Session:', session);
    console.log('User ID:', session.user.id);
    console.log('User Name:', session?.user.user_metadata);
    console.log('User Role:', session.user.app_metadata.role);
  };

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 0) return 'Just now'; // Handle case where server time might be slightly ahead
    return `${diffInDays} days ago`;
  };

  return (
    <div className="Dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome back, {session?.user.user_metadata.name || 'Artist'}</h1>
        <p className="dashboard-date">{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
      </div>

      {!(viewingInquiries || viewingAppointments || viewingSchedule) && (
        <div className="dashboard-container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="material-icons">today</span>
              <div className="stat-content">
                <h3>Today's Appointments</h3>
                <p>{dashboardStats.todayAppointments}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="material-icons">date_range</span>
              <div className="stat-content">
                <h3>Weekly Appointments</h3>
                <p>{dashboardStats.weeklyAppointments}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="material-icons">inbox</span>
              <div className="stat-content">
                <h3>Pending Inquiries</h3>
                <p>{dashboardStats.pendingInquiries}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="material-icons">calendar_month</span>
              <div className="stat-content">
                <h3>Total Appointments</h3>
                <p>{dashboardStats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="main-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <button className="action-button large" onClick={fetchInquiries}>
                <span className="material-icons">inbox</span>
                <span className="action-text">View Inquiries</span>
                <span className="action-subtext">Check and manage client requests</span>
              </button>
              <button className="action-button large" onClick={() => setViewingAppointments(true)}>
                <span className="material-icons">event</span>
                <span className="action-text">View Appointments</span>
                <span className="action-subtext">Manage your scheduled sessions</span>
              </button>
              <button className="action-button large" onClick={fetchSchedule}>
                <span className="material-icons">calendar_today</span>
                <span className="action-text">View Schedule</span>
                <span className="action-subtext">Check your availability</span>
              </button>
            </div>
          </div>

          <div className="secondary-actions">
            <h2>Account Management</h2>
            <div className="secondary-grid">
              <button className="action-button small" onClick={() => navigate('/manage-account')}>
                <span className="material-icons">manage_accounts</span>
                <span>Manage Account</span>
              </button>

              {session?.user?.app_metadata.role === 'admin' && (
                <button className="action-button small" onClick={() => navigate('/manage-employees')}>
                  <span className="material-icons">groups</span>
                  <span>Manage Employees</span>
                </button>
              )}

              <button className="action-button small logout" onClick={handleLogout}>
                <span className="material-icons">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {viewingInquiries && (
        <div className="content-container">
          <button className="back-button" onClick={() => setViewingInquiries(false)}>
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </button>

          <div className="inquiry-filter">
            <button
              className={inquiryFilter === 'all' ? 'active' : ''}
              onClick={() => setInquiryFilter('all')}
            >
              All
            </button>
            <button
              className={inquiryFilter === 'pending' ? 'active' : ''}
              onClick={() => setInquiryFilter('pending')}
            >
              Pending
            </button>
            <button
              className={inquiryFilter === 'accepted' ? 'active' : ''}
              onClick={() => setInquiryFilter('accepted')}
            >
              Accepted
            </button>
            <button
              className={inquiryFilter === 'rejected' ? 'active' : ''}
              onClick={() => setInquiryFilter('rejected')}
            >
              Rejected
            </button>
          </div>
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">inbox</span>
              <p>No inquiries found</p>
            </div>
          ) : (
            <div className="inquiries-list">
              {inquiries.map((inquiry) => (
                <div className="inquiry-row" key={inquiry.id}>
                  <div className="inquiry-header">
                    <div className="InquiryButtons">

                    </div>
                    <div className="inquiry-main-info">
                      <h2>{inquiry.client_name}'s Inquiry</h2>
                      <span className={`status-badge ${inquiry.status}`}>{inquiry.status}</span>
                      <span className="time-badge">
                        <span className="material-icons">schedule</span>
                        {calculateTimeAgo(inquiry.created_at)}
                      </span>
                    </div>
                    <p className="owner-text">Artist: {artistMapping[inquiry.artist_id] || 'Unknown'}</p>
                  </div>

                  <div className="inquiry-content">
                    <div className="inquiry-details">
                      <div className="detail-section">
                        <h3>Contact Information</h3>
                        <div className="info-group">
                          <span className="material-icons">email</span>
                          <p>{inquiry.client_email}</p>
                        </div>
                        <div className="info-group">
                          <span className="material-icons">phone</span>
                          <p>{inquiry.client_phone}</p>
                        </div>
                      </div>

                      <div className="detail-section">
                        <h3>Tattoo Details</h3>
                        <div className="info-group">
                          <span className="material-icons">description</span>
                          <p>{inquiry.tattoo_description}</p>
                        </div>
                        <div className="info-group">
                          <span className="material-icons">crop</span>
                          <p>{inquiry.approximate_size}</p>
                        </div>
                        <div className="info-group">
                          <span className="material-icons">location_on</span>
                          <p>{inquiry.placement}</p>
                        </div>
                      </div>

                      <div className="detail-section">
                        <h3>Additional Information</h3>
                        <div className="info-group">
                          <span className="material-icons">info</span>
                          <p>{inquiry.additional_info || 'No additional information provided.'}</p>
                        </div>
                      </div>
                    </div>

                    {inquiry.reference_images && inquiry.reference_images.length > 0 && (
                      <div className="reference-images-section">
                        <h3>Reference Images</h3>
                        <div className="images-grid">
                          {inquiry.reference_images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Reference ${idx + 1}`}
                              onClick={() => setSelectedImage(img)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="inquiry-actions">
                    <button className="action-btn accept" onClick={() => handleAccept(inquiry)}>
                      <span className="material-icons">check_circle</span>
                      Accept Inquiry
                    </button>
                    <button className="action-btn reject" onClick={() => handleReject(inquiry)}>
                      <span className="material-icons">cancel</span>
                      Reject Inquiry
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteInquiry(inquiry)}>
                      <span className="material-icons">delete</span>
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewingAppointments && (
        <>
          <button className="back-button" onClick={() => setViewingAppointments(false)}>
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </button>
          <ArtistAppointment
            viewingAppointments={viewingAppointments}
            setViewingAppointments={setViewingAppointments}
          />
        </>
      )}

      {viewingSchedule && (
        <>
          <button className="back-button" onClick={() => setViewingSchedule(false)}>
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </button>
          <ArtistSchedule
            schedule={schedule}
            fetchSchedule={fetchSchedule}
            artistId={session.user.id}
          />
        </>
      )}

      {selectedImage && (
        <div
          className="image-modal"
          onClick={() => setSelectedImage(null)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedImage(null);
          }}
        >
          <div className="modal-content">
            <img src={selectedImage} alt="Enlarged view" />
            <span className="close-modal" onClick={() => setSelectedImage(null)}>
              &times;
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;