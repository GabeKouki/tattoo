import React, { useState, useEffect, useRef } from 'react';
import { init } from '@emailjs/browser';
import { supabase } from '../../Utils/SupabaseClient';
import { sendEmail } from '../../Utils/EmailUtils';
import './ArtistPage.css';
import BarrettsPhoto from '../../Images/Barrett.jpg';
import { ReactComponent as TwitterIcon } from '../../Images/TwitterIcon.svg';
import { ReactComponent as InstagramIcon } from '../../Images/InstagramIcon.svg';
import { ReactComponent as FacebookIcon } from '../../Images/FacebookIcon.svg';
import Barrett1 from '../../Images/Barrett1.jpg';
import Barrett2 from '../../Images/Barrett2.jpg';
import Barrett3 from '../../Images/Barrett3.jpg';
import Barrett4 from '../../Images/Barrett4.jpg';
import Barrett5 from '../../Images/Barrett5.jpg';
import Barrett6 from '../../Images/Barrett6.jpg';
import Barrett7 from '../../Images/Barrett7.jpg';
import Barrett8 from '../../Images/Barrett8.jpg';
import Barrett9 from '../../Images/Barrett9.jpg';
import Barrett10 from '../../Images/Barrett10.jpg';
import Barrett11 from '../../Images/Barrett11.jpg';
import Barrett12 from '../../Images/Barrett12.jpg';
import Barrett13 from '../../Images/Barrett13.jpg';

const Barrett = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    init(process.env.REACT_APP_SHILOH_EMAILJS_PUBLIC_KEY);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tattooDescription: '',
    size: '',
    placement: '',
    references: null,
    additionalInfo: '',
  });

  const handleDialogOpen = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = 'hidden';
    }
  };

  const handleDialogClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = 'unset';
      setShowForm(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Get artist_id from the database
      const { data: artistData, error: artistError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'tattoos.by.shiloh@gmail.com') // Ensure email matches the one in your database
        .single();

      if (artistError || !artistData) {
        throw new Error('Failed to fetch artist ID.');
      }

      const artistId = artistData.id;

      // Step 2: Upload images to Supabase Storage
      let supabaseImageUrls = [];
      if (formData.references) {
        const files = Array.from(formData.references);
        const maxFiles = 3;
        const filesToProcess = files.slice(0, maxFiles);

        for (const file of filesToProcess) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('tattoo-references')
            .upload(fileName, file);

          if (error) throw error;

          const { data: publicUrlData } = supabase.storage
            .from('tattoo-references')
            .getPublicUrl(fileName);

          supabaseImageUrls.push(publicUrlData.publicUrl);
        }
      }

      // Step 3: Save inquiry to Supabase database
      const { error: dbError } = await supabase.from('inquiries').insert([
        {
          artist_id: artistId,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          tattoo_description: formData.tattooDescription,
          approximate_size: formData.size,
          placement: formData.placement,
          additional_info: formData.additionalInfo,
          reference_images: supabaseImageUrls,
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      // Step 4: Send email with EmailJS (without images)
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone || 'Not provided',
        tattoo_description: formData.tattooDescription,
        size: formData.size,
        placement: formData.placement,
        additional_info: formData.additionalInfo || 'None provided',
      };

      const result = await sendEmail(templateParams, ('Shiloh'));

      if (result.status === 200) {
        alert('Your inquiry has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          tattooDescription: '',
          size: '',
          placement: '',
          references: null,
          additionalInfo: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error processing submission:', error);
      alert('There was an error sending your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['all', 'fine line', 'realism', 'color'];

  const workExamples = [
    { id: 1, image: Barrett1, category: 'realism' },
    { id: 2, image: Barrett2, category: 'fine line' },
    { id: 3, image: Barrett3, category: 'realism' },
    { id: 4, image: Barrett4, category: 'realism' },
    { id: 5, image: Barrett5, category: 'fine line' },
    { id: 6, image: Barrett6, category: 'realism' },
    { id: 7, image: Barrett7, category: 'realism' },
    { id: 8, image: Barrett8, category: 'color' },
    { id: 9, image: Barrett9, category: 'realism' },
    { id: 10, image: Barrett10, category: 'fine line' },
    { id: 11, image: Barrett11, category: 'fine line' },
    { id: 12, image: Barrett12, category: 'realism' },    
    { id: 13, image: Barrett13, category: 'realism' },
  ];

  return (
    <div className="ArtistPage">
      <section className="ArtistIntro">
        <div className="ArtistProfile">
          <img src={BarrettsPhoto} alt="Shiloh" className="ArtistImage" />
          <div className="ArtistInfo">
            <h1>Barrett Leary</h1>
            <p className="ArtistBio">
              I'm Barrett, a passionate tattoo artist specializing in creating
              unique, custom designs that reflect my clients' individuality.
            </p>
            <div className="ArtistSocials">
              <ul className="SocialLinks">
                <li>
                  <a href="instagram-link">
                    <TwitterIcon className="SocialIcon" />
                  </a>
                </li>
                <li>
                  <a href="instagram-link">
                    <InstagramIcon className="SocialIcon" />
                  </a>
                </li>
                <li>
                  <a href="instagram-link">
                    <FacebookIcon className="SocialIcon" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ArtistPortfolio">
        <h2>Portfolio</h2>
        <div className="CategoryFilter">
          {categories.map((category) => (
            <button
              key={category}
              className={`FilterButton ${selectedCategory === category ? 'active' : ''
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="WorkGrid">
          {workExamples
            .filter(
              (work) =>
                selectedCategory === 'all' || work.category === selectedCategory
            )
            .map((work) => (
              <div key={work.id} className="WorkItem">
                <img src={work.image} alt={work.description} />
              </div>
            ))}
        </div>
      </section>
      <section className="BookingInquiry" ref={formRef}>
        <h2>Request an Appointment</h2>
        {!showForm && (
          <button className="InquiryButton" onClick={handleDialogOpen}>
            Start Booking Process
          </button>
        )}
        <dialog ref={dialogRef} className="BookingDialog">
          <h3>Booking Process Overview</h3>
          <div className="DialogContent">
            <p>
              Here's what happens when you request an appointment:
            </p>
            <ol>
              <li>Create an inquiry using the form below with details about your tattoo.</li>
              <li>We’ll review your submission and send you a personalized booking link.</li>
              <li>Use the link to select your preferred date and time.</li>
              <li>Your appointment will be confirmed after approval and payment of a deposit.</li>
            </ol>
            <p>
              Feel free to reach out with any questions during the process!
            </p>
          </div>
          <button className="DialogButton" onClick={handleDialogClose}>
            I Understand & Agree
          </button>
        </dialog>
        {showForm && (
          <form className="InquiryForm" onSubmit={handleFormSubmit}>
            <div className="FormGroup">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="tattooDescription">Tattoo Description *</label>
              <textarea
                id="tattooDescription"
                name="tattoo_description"
                required
                value={formData.tattooDescription}
                onChange={(e) =>
                  setFormData({ ...formData, tattooDescription: e.target.value })
                }
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="size">Approximate Size *</label>
              <input
                type="text"
                id="size"
                name="size"
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="placement">Placement on Body *</label>
              <input
                type="text"
                id="placement"
                name="placement"
                required
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="references">Reference Images (Max 3)</label>
              <input
                type="file"
                id="references"
                name="references"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 3) {
                    alert('Please select a maximum of 3 images');
                    e.target.value = '';
                    return;
                  }
                  setFormData({ ...formData, references: files });
                }}
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additional_info"
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
              />
            </div>
            <button type="submit" className="SubmitButton" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Barrett;
