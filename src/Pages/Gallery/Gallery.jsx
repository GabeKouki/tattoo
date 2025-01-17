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

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [randomizedImages, setRandomizedImages] = useState([]);

  const allImagesWithOwners = [
    { src: Audrey1, owner: "Audrey Jenkins" },
    { src: Audrey2, owner: "Audrey Jenkins" },
    { src: Audrey3, owner: "Audrey Jenkins" },
    { src: Audrey4, owner: "Audrey Jenkins" },
    { src: Audrey5, owner: "Audrey Jenkins" },
    { src: Audrey6, owner: "Audrey Jenkins" },
    { src: Audrey7, owner: "Audrey Jenkins" },
    { src: Audrey8, owner: "Audrey Jenkins" },
    { src: Audrey9, owner: "Audrey Jenkins" },
    { src: Audrey10, owner: "Audrey Jenkins" },
    { src: Audrey11, owner: "Audrey Jenkins" },
    { src: Audrey12, owner: "Audrey Jenkins" },
    { src: Christina1, owner: "Christina Aguilar" },
    { src: Christina2, owner: "Christina Aguilar" },
    { src: Christina3, owner: "Christina Aguilar" },
    { src: Christina4, owner: "Christina Aguilar" },
    { src: Christina5, owner: "Christina Aguilar" },
    { src: Christina6, owner: "Christina Aguilar" },
    { src: Christina7, owner: "Christina Aguilar" },
    { src: Christina8, owner: "Christina Aguilar" },
    { src: Christina9, owner: "Christina Aguilar" },
    { src: Christina10, owner: "Christina Aguilar" },
    { src: Christina11, owner: "Christina Aguilar" },
    { src: Christina12, owner: "Christina Aguilar" },
    { src: Christina13, owner: "Christina Aguilar" },
    { src: Christina14, owner: "Christina Aguilar" },
    { src: Christina15, owner: "Christina Aguilar" },
    { src: Barrett1, owner: "Barrett Leary" },
    { src: Barrett2, owner: "Barrett Leary" },
    { src: Barrett3, owner: "Barrett Leary" },
    { src: Barrett4, owner: "Barrett Leary" },
    { src: Barrett5, owner: "Barrett Leary" },
    { src: Barrett6, owner: "Barrett Leary" },
    { src: Barrett7, owner: "Barrett Leary" },
    { src: Barrett8, owner: "Barrett Leary" },
    { src: Barrett9, owner: "Barrett Leary" },
    { src: Barrett10, owner: "Barrett Leary" },
    { src: Barrett11, owner: "Barrett Leary" },
    { src: Barrett12, owner: "Barrett Leary" },
    { src: Barrett13, owner: "Barrett Leary" },
  ]

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
    setRandomizedImages(shuffleArray(allImagesWithOwners));
  }, []);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-container">
        <div className="gallery-header">
          <h1>Our Work</h1>
          <p>
            Explore our diverse collection of custom tattoos created by our talented
            artists. Each piece tells a unique story and showcases our commitment to
            quality and artistic excellence.
          </p>
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
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="clip">
                <img src={image.src} alt={`Tattoo artwork ${index + 1}`} loading="lazy" />
              </div>
              <span className="image-owner">By: {image.owner}</span>
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