import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Booking from './Pages/Booking';
import Aftercare from './Pages/Aftercare';
import FAQ from './Pages/FAQ';
import Policies from './Pages/Policies';
import NotFound from './Pages/NotFound';
import Christina from './Pages/Artists/Christina';
import Audrey from './Pages/Artists/Audrey';
import Login from './Pages/Dashboard/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import GenerateBookingLink from './Pages/GenerateBookingLink';
import BookAppointment from './Pages/BookAppointment';
import Navbar from './Components/Navbar/Navbar';
import Test from './Components/Test';


function App() {
  return (
    <div className="App">
      {/* Define the routes for the application */}
      <Navbar />
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/artists/Christina" element={<Christina />} />
        <Route path="/Audrey" element={<Audrey />} />
        <Route path="/Christina" element={<Christina />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/aftercare" element={<Aftercare />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/generate-booking-link/:artistId/:clientEmail"
          element={<GenerateBookingLink />}
        />
        <Route path="/book-appointment/:token" element={<BookAppointment />} />

        <Route path="/test" element={<Test />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
