import React, { useState, useEffect } from "react";
import { supabase } from "../../Utils/SupabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./Testimonials.css";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [animating, setAnimating] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching testimonials:', error);
      return;
    }
    if (data && data.length > 0) {
      setTestimonials(data);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleFormatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleAnimationEnd = () => {
    setSlideDirection("");
    setAnimating(false);
  };

  const nextSlide = () => {
    if (animating || !testimonials.length) return;
    setSlideDirection("slide-out-right");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setSlideDirection("slide-in-right");
    }, 500);
  };

  const prevSlide = () => {
    if (animating || !testimonials.length) return;
    setSlideDirection("slide-out-left");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setSlideDirection("slide-in-left");
    }, 500);
  };

  if (!testimonials.length) {
    return null; // or return a loading state
  }

  return (
    <section className="TestimonialsSection">
      <div className="TestimonialsContainer">
        <div
          className={`QuoteText ${slideDirection}`}
          onAnimationEnd={handleAnimationEnd}
        >
          <p>
            <FontAwesomeIcon icon={faQuoteLeft} className="QuoteIcons TopQuote" />
            {testimonials[currentIndex].message}
            <FontAwesomeIcon icon={faQuoteLeft} className="QuoteIcons BottomQuote" />
          </p>
        </div>
        <p className={`QuoteAuthor ${slideDirection}`} onAnimationEnd={handleAnimationEnd}>
          {testimonials[currentIndex].name}
        </p>
        <div className="Controls">
          <FontAwesomeIcon icon={faChevronLeft} className="Arrow" onClick={prevSlide} />
          <div className="SlideIndicator">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`Bubble ${index === currentIndex ? "Active" : ""}`}
                onClick={() => {
                  if (!animating && index !== currentIndex) {
                    const goingRight = index > currentIndex;
                    setSlideDirection(goingRight ? "slide-out-right" : "slide-out-left");
                    setAnimating(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setSlideDirection(goingRight ? "slide-in-right" : "slide-in-left");
                    }, 500);
                  }
                }}
              />
            ))}
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="Arrow" onClick={nextSlide} />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;