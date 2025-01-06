import React, { useEffect } from 'react';
import './Pages.css';

const Aftercare = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="Page">
      <h1>Tattoo Aftercare</h1>
      <div className="PageContent">
        <p>Aftercare instructions will go here</p>
      </div>
    </div>
  );
};

export default Aftercare;