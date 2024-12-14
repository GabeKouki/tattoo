import React from 'react';
import './MainHero.css';
import Carousel from '../Carousel/Carousel';


const MainHero = () => {
  return (
    <div className="HeroContainer">

    <div className="MapContent">
      <h1 className="MapTitle">Tattoo Studio</h1>
      <p className="MapDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies ultrices, orci ipsum aliquam nisi, eu tincidunt nisi nisl eu nisl. Nullam euismod, nisl eget ultricies ultrices, orci ipsum aliquam nisi, eu tincidunt nisi nisl eu nisl. Nullam euismod, nisl eget ultricies ultrices, orci ipsum aliquam nisi, eu tincidunt nisi nisl eu nisl.</p>
      <div className="MapContainer">
      <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.663577373223!2d-71.41504128494534!3d41.82018767922008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e4450b38a8f5c1%3A0xd9a7c6900a55792d!2s122%20Washington%20St%2C%20Providence%2C%20RI%2002903%2C%20USA!5e0!3m2!1sen!2sin!4v1702564853445!5m2!1sen!2sin"
            className="Map"
            loading="lazy"
          ></iframe>
      </div>
      <div className="MapButtonContainer">
        <button className="MapButton">Book Appointment</button>
        <button className="MapButton">Hours of Operation</button>
      </div>
    </div>








    <div className="CarouselContent">
      <Carousel />
    </div>
    </div>

  );
}

export default MainHero;