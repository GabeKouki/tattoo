import React, { useState, useEffect, useRef } from 'react';
import { init } from '@emailjs/browser';
import { supabase } from '../../Utils/SupabaseClient';
import { sendEmail } from '../../Utils/EmailUtils';
import './ArtistPage.css';
import AudreysPhoto from '../../Images/Audrey.jpeg';
import { ReactComponent as TwitterIcon } from '../../Images/TwitterIcon.svg';
import { ReactComponent as InstagramIcon } from '../../Images/InstagramIcon.svg';
import { ReactComponent as FacebookIcon } from '../../Images/FacebookIcon.svg';
import Audrey1 from '../../Images/Audrey1.jpeg';
import Audrey2 from '../../Images/Audrey2.jpeg';
import Audrey3 from '../../Images/Audrey3.jpeg';
import Audrey4 from '../../Images/Audrey4.jpeg';
import Audrey5 from '../../Images/Audrey5.jpeg';
import Audrey6 from '../../Images/Audrey6.jpeg';
import Audrey7 from '../../Images/Audrey7.jpeg';
import Audrey8 from '../../Images/Audrey8.jpeg';
import Audrey9 from '../../Images/Audrey9.jpeg';
import Audrey10 from '../../Images/Audrey10.jpeg';
import Audrey11 from '../../Images/Audrey11.jpeg';
import Audrey12 from '../../Images/Audrey12.jpeg';

const Audrey = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    init(process.env.REACT_APP_AUDREY_EMAILJS_PUBLIC_KEY);
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
        .eq('email', 'tattoos.by.audrey@gmail.com')
        .single();

      if (artistError || !artistData) {
        throw new Error('Failed to fetch artist ID.');
      }

      const artistId = artistData.id;

      // Step 2: Upload images to Supabase Storage
      let supabaseImageUrls = [];
      if (formData.references && formData.references.length > 0) {
        const files = Array.from(formData.references);

        // Process all files (up to 3)
        for (let i = 0; i < Math.min(files.length, 3); i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('tattoo-references')
            .upload(`references/${fileName}`, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error(`Error uploading file ${i + 1}:`, error);
            continue; // Skip this file if there's an error, but continue with others
          }

          const { data: publicUrlData } = supabase.storage
            .from('tattoo-references')
            .getPublicUrl(`references/${fileName}`);

          if (publicUrlData) {
            supabaseImageUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      // Rest of the submission logic...
      const inquiryData = {
        artist_id: artistId,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone || null,
        tattoo_description: formData.tattooDescription,
        approximate_size: formData.size,
        placement: formData.placement,
        additional_info: formData.additionalInfo || null,
        reference_images: supabaseImageUrls, // Now contains up to 3 image URLs
        status: 'pending',
        rejection_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('inquiries')
        .insert([inquiryData]);

      if (dbError) throw dbError;

      // Send notification email
      try {
        await sendEmail({
          artistEmail: 'tattoos.by.audrey@gmail.com',
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone || 'Not provided',
          tattooDescription: formData.tattooDescription,
          size: formData.size,
          placement: formData.placement,
          additionalInfo: formData.additionalInfo || 'None provided',
          hasReferences: supabaseImageUrls.length > 0,
          numberOfReferences: supabaseImageUrls.length
        }, 'Audrey');
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }

      alert('Your inquiry has been sent successfully!');
      // Reset form
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

    } catch (error) {
      console.error('Error processing submission:', error);
      alert('There was an error sending your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['all', 'fine line', 'realism', 'color'];

  const workExamples = [
    { id: 1, image: Audrey1, category: 'realism' },
    { id: 2, image: Audrey2, category: 'fine line' },
    { id: 3, image: Audrey3, category: 'realism' },
    { id: 4, image: Audrey4, category: 'realism' },
    { id: 5, image: Audrey5, category: 'fine line' },
    { id: 6, image: Audrey6, category: 'realism' },
    { id: 7, image: Audrey7, category: 'realism' },
    { id: 8, image: Audrey8, category: 'color' },
    { id: 9, image: Audrey9, category: 'realism' },
    { id: 10, image: Audrey10, category: 'fine line' },
    { id: 11, image: Audrey11, category: 'fine line' },
    { id: 12, image: Audrey12, category: 'realism' },
  ];

  return (
    <div className="ArtistPage">
      <section className="ArtistIntro">
        <div className="ArtistProfile">
          <img src={AudreysPhoto} alt="Audrey" className="ArtistImage" />
          <div className="ArtistInfo">
            <h1>Audrey Jenkins</h1>
            <p className="ArtistBio">
              I'm Audrey, a passionate tattoo artist specializing in creating
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
              <div className="file-upload-container">
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
                <small className="file-info">
                  {formData.references ?
                    `${Array.from(formData.references).length} file(s) selected` :
                    'No files selected'}
                </small>
              </div>
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

export default Audrey;
