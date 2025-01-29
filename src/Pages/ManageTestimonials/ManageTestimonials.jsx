import React, { useState, useEffect } from 'react';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { useNavigate } from 'react-router-dom';
import './ManageTestimonials.css';

const ManageTestimonials = () => {
  const { session } = useSession();
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    message: '',
    submitted_date: new Date().toISOString().split('T')[0]
  });
  const navigate = useNavigate();

  const handleFormatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
    if (error) {
      throw error;
    }
    data.forEach(testimonial => {
      testimonial.created_at = handleFormatDate(testimonial.created_at);
    });
    setTestimonials(data);
  };

  useEffect(() => {
    if (session.user.app_metadata.role !== 'admin') {
      navigate('/dashboard');
    }
    fetchTestimonials();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleAddTestimonial = async () => {
    const { data, error } = await supabase.from('testimonials').insert([{
      name: newTestimonial.name,
      message: newTestimonial.message,
      created_at: new Date(newTestimonial.submitted_date).toISOString() // Convert the date to ISO format
    }]);

    if (error) {
      console.error('Error adding testimonial:', error);
 
    } else {
      setShowModal(false);
      setNewTestimonial({
        name: '',
        message: '',
        submitted_date: new Date().toISOString().split('T')[0]
      });
      fetchTestimonials();
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) {
        console.error('Error deleting testimonial:', error);
      } else {
        fetchTestimonials(); // Refresh the list after deletion
      }
    }
  };

  return (
    <div className="ManageTestimonialsContainer">
      <div className="TestimonialsActionBar">
        <button className="action-button" onClick={() => setShowModal(true)}>Add Testimonial</button>
        <button className="action-button" onClick={handleBackToDashboard}>Back to Dashboard</button>
      </div>
      <h1 className="page-title">Current Testimonials</h1>
      {testimonials.map((testimonial, index) => (
        <div className="TestimonialDisplayContainer" key={index}>
          <div className="testimonial-header">
            <h1>ID: {testimonial.id}</h1>
            <button
              className='delete-button'
              onClick={() => handleDeleteTestimonial(testimonial.id)}
            >
              Delete
            </button>
          </div>
          <p className="testimonial-message">{testimonial.message}</p>
          <p className="testimonial-author">{testimonial.name}</p>
          <p className="testimonial-date">{testimonial.created_at}</p>
        </div>
      ))}

      {showModal && (
        <div className="ModalOverlay">
          <div className="ModalContainer">
            <h2>Add Testimonial</h2>
            <label>Name</label>
            <input
              type="text"
              placeholder="Submitter Name"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            />
            <label>Message</label>
            <textarea
              placeholder="Message"
              value={newTestimonial.message}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, message: e.target.value })}
            />
            <label>Submission Date</label>
            <input
              type="date"
              value={newTestimonial.submitted_date}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, submitted_date: e.target.value })}
            />
            <div className="ModalActions">
              <button onClick={() => setShowModal(false)} className="action-button">Cancel</button>
              <button onClick={handleAddTestimonial} className="action-button">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
