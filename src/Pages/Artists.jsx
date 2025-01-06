import React from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css';

const Artists = () => {
  const { style } = useParams();

  return (
    <div className="Page">
      <h1>{style ? `${style.charAt(0).toUpperCase() + style.slice(1)} Artists` : 'Our Artists'}</h1>
      <div className="PageContent">
        <p>Artist listings will go here</p>
      </div>
    </div>
  );
};

export default Artists;