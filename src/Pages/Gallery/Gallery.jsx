import React, { useState, useEffect } from 'react';
import './Gallery.css';

// Audrey Images
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

// Christina Images
import Christina1 from '../../Images/Christina1.jpg';
import Christina2 from '../../Images/Christina2.jpg';
import Christina3 from '../../Images/Christina3.jpg';
import Christina4 from '../../Images/Christina4.jpg';
import Christina5 from '../../Images/Christina5.jpg';
import Christina6 from '../../Images/Christina6.jpg';
import Christina7 from '../../Images/Christina7.jpg';
import Christina8 from '../../Images/Christina8.jpg';
import Christina9 from '../../Images/Christina9.jpg';
import Christina10 from '../../Images/Christina10.jpg';
import Christina11 from '../../Images/Christina11.jpg';
import Christina12 from '../../Images/Christina12.jpg';
import Christina13 from '../../Images/Christina13.jpg';
import Christina14 from '../../Images/Christina14.jpg';
import Christina15 from '../../Images/Christina15.jpg';

// Shiloh Images
import Shiloh1 from '../../Images/Shiloh1.jpg';
import Shiloh2 from '../../Images/Shiloh2.jpg';
import Shiloh3 from '../../Images/Shiloh3.jpg';
import Shiloh4 from '../../Images/Shiloh4.jpg';
import Shiloh5 from '../../Images/Shiloh5.jpg';
import Shiloh6 from '../../Images/Shiloh6.jpg';
import Shiloh7 from '../../Images/Shiloh7.jpg';
import Shiloh8 from '../../Images/Shiloh8.jpg';
import Shiloh9 from '../../Images/Shiloh9.jpg';
import Shiloh10 from '../../Images/Shiloh10.jpg';
import Shiloh11 from '../../Images/Shiloh11.jpg';
import Shiloh12 from '../../Images/Shiloh12.jpg';
import Shiloh13 from '../../Images/Shiloh13.jpg';
import Shiloh14 from '../../Images/Shiloh14.jpg';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [randomizedImages, setRandomizedImages] = useState([]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const allImages = [
      Audrey1, Audrey2, Audrey3, Audrey4, Audrey5, Audrey6, Audrey7, Audrey8, Audrey9, Audrey10, Audrey11, Audrey12,
      Christina1, Christina2, Christina3, Christina4, Christina5, Christina6, Christina7, Christina8, Christina9, 
      Christina10, Christina11, Christina12, Christina13, Christina14, Christina15,
      Shiloh1, Shiloh2, Shiloh3, Shiloh4, Shiloh5, Shiloh6, Shiloh7, Shiloh8, Shiloh9, Shiloh10, 
      Shiloh11, Shiloh12, Shiloh13, Shiloh14
    ];
    setRandomizedImages(shuffleArray(allImages));
  }, []);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-container">
        <div className="gallery-header">
          <h1>Our Work</h1>
          <p>Explore our diverse collection of custom tattoos created by our talented artists. 
             Each piece tells a unique story and showcases our commitment to quality and artistic excellence.</p>
          <div className="header-separator">
            <span className="separator-line"></span>
            <span className="separator-icon">✦</span>
            <span className="separator-line"></span>
          </div>
        </div>

        <div className="gallery-grid">
          {randomizedImages.map((image, index) => (
            <div 
              className="gallery-item"
              key={index}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Tattoo artwork ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Selected artwork" />
        </div>
      )}
    </div>
  );
};

export default Gallery;