import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    quote: "Audrey is amazing! She does wonderful detail and really captured exactly what I was looking for. Wonderful vibe in the place and felt very comfortable. Will definitely be back!",
    author: "Meg B.",
    date: "August 2024"
  },
  {
    id: 2,
    quote: "Audrey did a fantastic job! Worked with us to get it just right before putting it on. Her blending and lines are just beautiful. Highly recommend!",
    author: "Lauren M.",
    date: "July 2024"
  },
  {
    id: 3,
    quote: "Above the clouds tattoo is Amazing!! I got my first tattoo, by Elsa and It's absolutely beautiful. I highly recommend her. She is amazing, kind and her work is truly beautiful. She also helped me decide the best place for my tattoo and style. I can't wait to go back, and add more.",
    author: "Jessica K.",
    date: "October 2023"
  },
  {
    id: 4,
    quote: "Elsa did my husband and I's wedding date tattoos and I love them!! She's so soft handed and the atmosphere was great.  Will definitely be coming back next time we are in Colorado!",
    author: "Jessica S,",
    date: "December 2021"
  },
  {
    id: 5,
    quote: "Great staff and amazing work. Ask for Barrett she's the best.",
    author: "Fabian L.",
    date: "August 2020"
  },
  {
    id: 6,
    quote: "Barrett's color techniques are really incredible. She reimagined a large back piece I've had for 4 years that needed transformation and serious color. We have done session 1 of 3. She is patient & kind. All the gals in the shop have such fun character, I enjoyed my experience and look forward to my next session.",
    author: "Unkempt R.",
    date: "July 2020"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="TestimonialsSection">
      <div className="TestimonialsContainer">
        <FontAwesomeIcon icon={faQuoteLeft} className="QuoteIcon" />
        
        <div className="TestimonialContent">
          <button 
            className="NavButton PrevButton" 
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          <div className="TestimonialTrack">
            <div 
              className="TestimonialSlider" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="TestimonialItem">
                  <p className="Quote">{testimonial.quote}</p>
                  <div className="TestimonialFooter">
                    <p className="Author">{testimonial.author}</p>
                    <p className="Date">{testimonial.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="NavButton NextButton" 
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>

        <div className="TestimonialDots">
          {testimonials.map((_, index) => (
            <span 
              key={index} 
              className={`Dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;