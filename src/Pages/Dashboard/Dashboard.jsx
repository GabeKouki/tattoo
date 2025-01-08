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


  useEffect(() => {
    const fetchArtistMapping = async () => {
      try {
        const { data, error } = await supabase
          .from('users') // Replace 'artists' with the correct table name for storing artist details
          .select('id, name');

        if (error) throw error;

        // Create a mapping of artist_id to artist name
        const mapping = {};
        data.forEach((artist) => {
          mapping[artist.id] = artist.name;
        });
        setArtistMapping(mapping);
      } catch (err) {
        console.error('Error fetching artist mapping:', err);
      }
    };

    fetchArtistMapping();

    if (!session) {
      navigate('/login');
    }

  }, [session, navigate]);


  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('artist_id', session.user.id) // Fetch only the logged-in artist's appointments
        .order('date', { ascending: true });

      if (error) throw error;

      console.log('Schedule:', data);
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
    await logout(); // Ends the session
    navigate('/login'); // Redirect to the login page
  };




  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase.from('inquiries').select('*').order('created_at', { ascending: true });

      if (session.user.app_metadata.role !== 'admin') {
        query = query.eq('artist_id', session.user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Fetched Inquiries:', data); // Debug fetched inquiries
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
      console.log('Inquiry passed to handleDeleteInquiry:', inquiry);

      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', inquiry.id);

      if (error) {
        console.log('Error deleting inquiry:', error)
        alert('Failed to delete inquiry.');
        return;
      }

      alert('Inquiry deleted successfully.');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry.');
    }

    fetchInquiries();
  }


  const handleAccept = async (inquiry) => {
    console.log('Inquiry passed to handleAccept:', inquiry);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'accepted' })
        .eq('id', inquiry.id);

      if (error) throw error;
      console.log(inquiry.id)

      // Redirect and pass the inquiryID and clientEmail as state
      navigate(`/generate-booking-link/${inquiry.id}/${encodeURIComponent(inquiry.client_email)}`, {
        state: { inquiryID: inquiry.id, clientEmail: inquiry.client_email },
      });
    } catch (err) {
      console.error('Error accepting inquiry:', err);
      alert('Failed to accept inquiry.');
    }
  };

  const handleReject = async (inquiry) => {
    // Create dialog for rejection reason
    const reasonDialog = document.createElement('dialog');
    reasonDialog.innerHTML = `
      <div style="padding: 20px; min-width: 300px;">
        <h3>Reject Inquiry</h3>
        <p>Please provide a reason for rejecting this inquiry:</p>
        <textarea 
          id="rejection-reason" 
          style="width: 100%; min-height: 100px; margin: 10px 0; padding: 8px;"
          placeholder="Enter rejection reason..."
        ></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
          <button id="cancel-reject" style="padding: 8px 16px;">Cancel</button>
          <button id="confirm-reject" style="padding: 8px 16px; background-color: #dc3545; color: white; border: none;">
            Reject Inquiry
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(reasonDialog);
    reasonDialog.showModal();

    // Handle dialog buttons
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
        // Update inquiry status in database
        const { error } = await supabase
          .from('inquiries')
          .update({
            status: 'rejected',
            rejection_reason: reason
          })
          .eq('id', inquiry.id);

        if (error) throw error;

        console.log('Sending email with params:', {
          to_name: inquiry.client_name,
          to_email: inquiry.client_email,
          message: reason,
          from_name: session?.user.user_metadata.name || 'The Artist',
          reply_to: inquiry.client_email
      });

        // Send rejection email
        await sendRejectionEmail({
          clientEmail: inquiry.client_email, 
          clientName: inquiry.client_name,    
          rejectionReason: reason,                   
          artistName: session?.user.user_metadata.name || 'The Artist',
      });
        // Update local state
        // setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
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

    // Handle dialog close
    reasonDialog.addEventListener('close', () => {
      if (document.body.contains(reasonDialog)) {
        document.body.removeChild(reasonDialog);
      }
    });
  };

  const handleTest = async (inquiry) => {
    // console.log('Test function called');
    // console.log('Session:', session);
    // console.log('User:', session.user.id)
    // console.log('User:', session?.user.user_metadata.name);
    // console.log('Role:', session.user.app_metadata.role);
    console.log('Inquiry:', inquiry.client_email)
  }
  return (
    <div className="Dashboard">
      <h1>Hello {session?.user.user_metadata.name || 'Artist'}</h1>
      {!(viewingInquiries || viewingAppointments || viewingSchedule) && (
        <div className="dashboard-container">
          <div className="main-actions">
            <button className="action-button large" onClick={fetchInquiries}>
              <span className="material-icons">inbox</span>
              View Inquiries
            </button>
            <button className="action-button large" onClick={() => setViewingAppointments(true)}>
              <span className="material-icons">event</span>
              View Appointments
            </button>
            <button className="action-button large" onClick={fetchSchedule}>
              <span className="material-icons">calendar_today</span>
              View Schedule
            </button>
          </div>

          <div className="secondary-actions">
            <button className="action-button small" onClick={() => navigate('/manage-account')}>
              <span className="material-icons">manage_accounts</span>
              <span>Manage Account</span>
            </button>

            {session?.user?.role === 'admin' && (
              <button className="action-button small" onClick={() => navigate('/manage-employees')}>
                <span className="material-icons">groups</span>
                <span>Manage Employees</span>
              </button>
            )}

            <button className="action-button small" onClick={handleLogout}>
              <span className="material-icons">logout</span>
              <span>Logout</span>
            </button>

            <button className="action-button small" onClick={handleTest}>
              <span className="material-icons">groups</span>
              <span>Manage Employees</span>
            </button>
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

          <div className="content-grid">
            {inquiries.length === 0 ? (
              <div className="empty-state">
                <span className="material-icons">inbox</span>
                <p>No inquiries found</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div className="card inquiry-card" key={inquiry.id}>
                  <div className="card-header">
                    <h2>{`${inquiry.client_name}'s Inquiry`}</h2>
                    <span className={`status-badge ${inquiry.status}`}>{inquiry.status}</span>
                  </div>

                  <div className="card-content">
                    <div className="info-group">
                      <span className="material-icons">email</span>
                      <p>{inquiry.client_email}</p>
                    </div>

                    <div className="info-group">
                      <span className="material-icons">phone</span>
                      <p>{inquiry.client_phone}</p>
                    </div>

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

                    <div className="info-group">
                      <span className="material-icons">info</span>
                      <p>{inquiry.additional_info}</p>
                    </div>


                    {inquiry.reference_images && inquiry.reference_images.length > 0 && (
                      <div className="reference-images">
                        <h4>Reference Images</h4>
                        <div className="images-grid">
                          {inquiry.reference_images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Reference ${idx + 1}`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button className="action-btn accept" onClick={() => handleAccept(inquiry)}>
                      <span className="material-icons">check_circle</span>
                      Accept
                    </button>
                    <button className="action-btn reject" onClick={() => handleReject(inquiry)}>
                      <span className="material-icons">cancel</span>
                      Reject
                    </button>
                    {/* //TODO Delete any inquiry where status has not changed for > 30 days */}
                    <button className="action-btn delete" onClick={() => handleDeleteInquiry(inquiry)}>
                      <span className="material-icons">delete</span>
                      Delete
                    </button>
                  </div>
                  {session.user.app_metadata.role === 'admin'&& (
                  <div className="card-footer">
                    <p>Owner: {artistMapping[inquiry.artist_id] || 'Unknown'}</p>
                  </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewingAppointments && (
        <>
          <button className="back-button" onClick={() => setViewingAppointments(false)}>Back to Dashboard</button>
          <ArtistAppointment
            viewingAppointments={viewingAppointments}
            setViewingAppointments={setViewingAppointments}
          />
        </>
      )}

      {viewingSchedule && (
        <>
          <button className="back-button" onClick={() => setViewingSchedule(false)}>Back to Dashboard</button>
          <ArtistSchedule
            schedule={schedule}
            fetchSchedule={fetchSchedule}
            artistId={session.user.id}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
