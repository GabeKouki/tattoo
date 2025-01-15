import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    quote: "Audrey is amazing! She does wonderful detail and really captured exactly what I was looking for. Wonderful vibe in the place and felt very comfortable. Will definitely be back!",
    author: "Meg B.",
  },
  {
    id: 2,
    quote: "Audrey did a fantastic job! Worked with us to get it just right before putting it on. Her blending and lines are just beautiful. Highly recommend!",
    author: "Lauren M.",
  },
  {
    id: 3,
    quote: "Above the clouds tattoo is Amazing!! I got my first tattoo, by Elsa and It's absolutely beautiful. I highly recommend her. She is amazing, kind and her work is truly beautiful. She also helped me decide the best place for my tattoo and style. I can't wait to go back, and add more.",
    author: "Jessica K.",
  },
  {
    id: 4,
    quote: "Elsa did my husband and I's wedding date tattoos and I love them!! She's so soft-handed and the atmosphere was great. Will definitely be coming back next time we are in Colorado!",
    author: "Jessica S.",
  },
  {
    id: 5,
    quote: "Great staff and amazing work. Ask for Barrett she's the best.",
    author: "Fabian L.",
  },
  {
    id: 6,
    quote: "Barrett's color techniques are really incredible. She reimagined a large back piece I've had for 4 years that needed transformation and serious color. We have done session 1 of 3. She is patient & kind. All the gals in the shop have such fun character, I enjoyed my experience and look forward to my next session.",
    author: "Unkempt R.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [animating, setAnimating] = useState(false);

  const handleAnimationEnd = () => {
    setSlideDirection("");
    setAnimating(false);
  };

  const nextSlide = () => {
    if (animating) return;
    setSlideDirection("slide-out-right");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setSlideDirection("slide-in-right");
    }, 500);
  };

  const prevSlide = () => {
    if (animating) return;
    setSlideDirection("slide-out-left");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setSlideDirection("slide-in-left");
    }, 500);
  };

  return (
    <section className="TestimonialsSection">
      <div className="TestimonialsContainer">
        <FontAwesomeIcon icon={faQuoteLeft} className="QuoteIcons TopQuote" />
        <div
          className={`QuoteText ${slideDirection}`}
          onAnimationEnd={handleAnimationEnd}
        >
          {testimonials[currentIndex].quote}
        </div>
        <p className={`QuoteAuthor ${slideDirection}`} onAnimationEnd={handleAnimationEnd}>{testimonials[currentIndex].author}</p>
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
        <FontAwesomeIcon icon={faQuoteLeft} className="QuoteIcons BottomQuote" />
      </div>
    </section>
  );
};

export default Testimonials;
