import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DashboardHeader.css";

const DashboardHeader = ({ artistData }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="DashboardHeader">
      <nav className="DashboardNav">
        <h3>Welcome Back {artistData.first_name}</h3>
        <h3>{date.toDateString() + " " + date.toLocaleTimeString()}</h3>
        <button><Link to="/">Back to Website</Link></button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
