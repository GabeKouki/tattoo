import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import './Dashboard.css';

const Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [viewingInquiries, setViewingInquiries] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTest = async (inquiry) => {
    console.log('Inquiry passed to handleTest:', inquiry);
    console.log('Inquiry ID:', inquiry.id);
  }


  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('artist_id', session.user.id) // Fetch only the logged-in artist's inquiries
        .order('created_at', { ascending: true });

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
    const reason = prompt('Enter a reason for rejecting this inquiry:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', inquiry.id);

      if (error) throw error;

      alert(`Inquiry from ${inquiry.client_name} has been rejected.`);
      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id)); // Remove rejected inquiry
    } catch (err) {
      console.error('Error rejecting inquiry:', err);
      alert('Failed to reject inquiry.');
    }
  };

  return (
    <div className="Dashboard">
      <h1>Welcome, {session?.user?.email || 'Artist'}</h1>
      {!viewingInquiries && (
        <div className="DashboardButtons">
          <button onClick={fetchInquiries}>View Inquiries</button>
          <button onClick={() => navigate('/manage-appointments')}>Manage Appointments</button>
          <button onClick={() => navigate('/generate-report')}>Generate Report</button>
          <button onClick={() => navigate('/manage-account')}>Manage Account</button>
        </div>
      )}
      {loading && <p>Loading inquiries...</p>}
      {viewingInquiries && (
        <div className="Inquiries">
          <button className="BackButton" onClick={() => setViewingInquiries(false)}>
            Back to Dashboard
          </button>
          {inquiries.length === 0 ? (
            <p>No inquiries found.</p>
          ) : (
            inquiries.map((inquiry) => (
              <div className="InquiryCard" key={inquiry.id}>
                <h2>{inquiry.client_name}</h2>
                <p>Email: {inquiry.client_email}</p>
                <p>Description: {inquiry.tattoo_description}</p>
                <p>Status: {inquiry.status}</p>
                {inquiry.reference_images && inquiry.reference_images.length > 0 && (
                  <div className="ReferenceImages">
                    <h4>Reference Images:</h4>
                    {inquiry.reference_images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Reference ${idx + 1}`} />
                    ))}
                  </div>
                )}
                <button onClick={() => handleAccept(inquiry)}>Accept</button>
                <button onClick={() => handleReject(inquiry)}>Reject</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
