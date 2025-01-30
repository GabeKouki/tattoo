import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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
import { SessionProvider } from './Context/SessionContext';
import ProtectedRoute from './Context/ProtectedRoute';
import Gallery from './Pages/Gallery/Gallery';
import Barrett from './Pages/Artists/Barrett';
import ManageAccount from './Components/ManageAccount/ManageAccount';
import ManageEmployees from './Pages/ManageEmployees/ManageEmployees';
import ManageTestimonials from './Pages/ManageTestimonials/ManageTestimonials';
import Sidebar from './Pages/Dashboard/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sidebar" element={<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        {/* <Route path="/Barrett" element={<Barrett />} />
        <Route path="/Audrey" element={<Audrey />} />
        <Route path="/Christina" element={<Christina />} /> */}
        <Route path="/booking" element={<Booking />} />
        <Route path="/aftercare" element={<Aftercare />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/book-appointment/:token" element={<BookAppointment />} />

        <Route path="/login" element={
          <SessionProvider>
            <Login />
          </SessionProvider>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <SessionProvider>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </SessionProvider>
        } />
         
        <Route
          path="/generate-booking-link/:artistId/:clientEmail"
          element={
            <SessionProvider>
              <ProtectedRoute>
                <GenerateBookingLink />
              </ProtectedRoute>
            </SessionProvider>
          }
        />

        <Route path="/manage-account" element={
          <SessionProvider>
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          </SessionProvider>
        }/>

        <Route path="/manage-employees" element={
          <SessionProvider>
            <ProtectedRoute>
              <ManageEmployees />
            </ProtectedRoute>
          </SessionProvider>
        } />

        <Route path="/manage-testimonials" element={
          <SessionProvider>
            <ProtectedRoute>
              <ManageTestimonials />
            </ProtectedRoute>
          </SessionProvider>
        } />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
