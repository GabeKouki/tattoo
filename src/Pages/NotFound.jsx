import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const NotFound = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="Page">
      <h1>404 - Page Not Found</h1>
      <div className="PageContent">
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="BackButton">Return Home</Link>
      </div>
    </div>
  );
};

export default NotFound;