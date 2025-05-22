import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Home from "./Pages/Home";
import Booking from "./Pages/Booking";
import Aftercare from "./Pages/Aftercare";
import FAQ from "./Pages/FAQ";
import Policies from "./Pages/Policies";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Dashboard/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import GenerateBookingLink from "./Pages/GenerateBookingLink";
import BookAppointment from "./Pages/BookAppointment";
import { SessionProvider } from "./Context/SessionContext";
import ProtectedRoute from "./Context/ProtectedRoute";
import Gallery from "./Pages/Gallery/Gallery";
import ManageAccount from "./Components/ManageAccount/ManageAccount";
import ManageEmployees from "./Pages/ManageEmployees/ManageEmployees";
import ManageTestimonials from "./Pages/ManageTestimonials/ManageTestimonials";
import ArtistSchema from "./Pages/Artists/ArtistPage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/artists/:artistId" element={<ArtistSchema />} />
        {/* <Route path="/booking" element={<Booking />} /> */}
        <Route path="/aftercare" element={<Aftercare />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/book-appointment/:token" element={<BookAppointment />} />

        <Route
          path="/login"
          element={
            //           <SessionProvider>
            <Login />
            //        </SessionProvider>
          }
        />

        {/* Protected Routes */}
        {/* <Route path="/dashboard" element={
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
        } /> */}

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
