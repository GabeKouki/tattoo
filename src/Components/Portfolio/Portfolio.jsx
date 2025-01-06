import React, { useState } from 'react';
import './Portfolio.css';

const services = [
  {
    title: "Fine Line",
    image: "https://via.placeholder.com/400x600",
    description: "Delicate and precise tattoos that focus on intricate designs.",
    category: "fineline"
  },
  {
    title: "Realism",
    image: "https://via.placeholder.com/400x500",
    description: "Highly detailed tattoos resembling real-life imagery.",
    category: "realism"
  },
  {
    title: "Traditional",
    image: "https://via.placeholder.com/400x700",
    description: "Bold designs with bright colors and classic tattoo motifs.",
    category: "traditional"
  },
  {
    title: "Blackwork",
    image: "https://via.placeholder.com/400x550",
    description: "Tattoo styles focusing on solid black ink and geometric patterns.",
    category: "blackwork"
  },
  {
    title: "Abstract",
    image: "https://via.placeholder.com/400x400",
    description: "Artistic tattoos with unique and creative designs.",
    category: "abstract"
  }
];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = ['all', 'fineline', 'realism', 'traditional', 'blackwork', 'abstract'];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <section className="PortfolioSection">
      <div className="PortfolioContainer">
        <h2 className="PortfolioTitle">Gallery Preview</h2>
        <p className="PortfolioSubtitle">Explore our diverse styles and artistic vision</p>
        
        <div className="PortfolioCategories">
          {categories.map((category) => (
            <button
              key={category}
              className={`CategoryButton ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="PortfolioGrid">
          {filteredServices.map((service, index) => (
            <div 
              key={index} 
              className="PortfolioItem"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="PortfolioImageWrapper">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="PortfolioImage"
                />
                <div className={`PortfolioOverlay ${hoveredIndex === index ? 'active' : ''}`}>
                  <h3 className="PortfolioItemTitle">{service.title}</h3>
                  <p className="PortfolioItemDescription">{service.description}</p>
                  <button className="ViewMoreButton">View More</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="PortfolioFooter">
          <button className="ViewFullGalleryButton">
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;