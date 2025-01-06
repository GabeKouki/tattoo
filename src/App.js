import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Artists from './Pages/Artists';
import Booking from './Pages/Booking';
import Aftercare from './Pages/Aftercare';
import FAQ from './Pages/FAQ';
import Policies from './Pages/Policies';
import NotFound from './Pages/NotFound';
import Christina from './Pages/Artists/Christina';
import Audrey from './Pages/Artists/Audrey';
import Login from './Pages/Dashboard/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Inquiries from './Pages/Dashboard/Inquiries';
import ManageEmployees from './Pages/Dashboard/ManageEmployees';
import Navbar from './Components/Navbar/Navbar';
import GenerateBookingLink from './Pages/GenerateBookingLink';
import BookAppointment from './Pages/BookAppointment';


function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/Christina" element={<Christina />} />
          <Route path="/artists/Audrey" element={<Audrey />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/aftercare" element={<Aftercare />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route
            path="/generate-booking-link/:artistId/:clientEmail"
            element={<GenerateBookingLink />}
          />



          <Route path="/book-appointment/:token" element={<BookAppointment />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
