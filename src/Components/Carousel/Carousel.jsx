import React, { useState, useEffect } from 'react';
import './Carousel.css';
import image1 from '../../Images/1.jpg';
import image2 from '../../Images/2.jpg';
import image3 from '../../Images/3.jpg';
import image4 from '../../Images/4.jpg';
import image5 from '../../Images/5.jpg';
import image6 from '../../Images/6.jpg';
import image8 from '../../Images/8.jpg';
import image9 from '../../Images/9.jpg';
import image10 from '../../Images/10.jpg';
import image11 from '../../Images/11.jpg';
import image12 from '../../Images/12.jpg';
import image13 from '../../Images/13.jpg';
import image14 from '../../Images/14.jpg';

const Carousel = () => {
  const images = [image1, image2, image3, image4, image5, image6, image8, image9, image10, image11, image12, image13, image14];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="CarouselContainer">
      <div className="Carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`Slide ${index === currentIndex ? 'Active' : 'Inactive'}`}
          >
            {index === currentIndex && (
              <div className="CarouselImageWrapper">
                <img src={image} alt={`Slide ${index}`} className="CarouselImage" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="SlideIndicator">
        <button onClick={prevSlide} className="IndicatorBubble">{(currentIndex - 1 + images.length) % images.length + 1}</button>
        <div className="MainIndicatorBubble">{currentIndex + 1}</div>
        <button onClick={nextSlide} className="IndicatorBubble">{(currentIndex + 1) % images.length + 1}</button>
      </div>
    </div>
  );
};

export default Carousel;
