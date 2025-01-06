// // src/Pages/SecureBooking/SecureBooking.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import DateSelector from '../../Components/Booking/DateSelector';
// import TimeSlots from '../../Components/Booking/TimeSlots';
// import BookingConfirmation from '../../Components/Booking/BookingConfirmation';
// import { getAvailableTimeSlots, createBooking } from '../../Utils/BookingUtils';
// import './SecureBooking.css';

// const SecureBooking = () => {
//   const { artistId, duration } = useParams();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bookingStep, setBookingStep] = useState('date'); // 'date', 'time', 'confirm'

//   useEffect(() => {
//     const fetchTimeSlots = async () => {
//       if (selectedDate) {
//         setIsLoading(true);
//         setError(null);
//         try {
//           const slots = await getAvailableTimeSlots(artistId, selectedDate, duration);
//           setAvailableSlots(slots);
//         } catch (error) {
//           console.error('Error fetching time slots:', error);
//           setError('Failed to load available times. Please try again.');
//           setAvailableSlots([]);
//         }
//         setIsLoading(false);
//       }
//     };

//     fetchTimeSlots();
//   }, [selectedDate, artistId, duration]);

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     setSelectedTime(null);
//     setBookingStep('time');
//   };

//   const handleTimeSelect = (slot) => {
//     setSelectedTime(slot);
//     setBookingStep('confirm');
//   };

//   const handleConfirmBooking = async (clientInfo) => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const bookingData = {
//         artistId,
//         clientInfo,
//         selectedDate,
//         selectedTime,
//         duration
//       };

//       const booking = await createBooking(bookingData);
    
//       // TODO 
//       //TODO 1. Redirect to payment
//       //TODO 2. Show success message
//       //TODO 3. Send confirmation email
    
//       console.log('Booking created:', booking);
    
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       setError('Failed to create booking. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBack = () => {
//     setError(null);
//     if (bookingStep === 'confirm') {
//       setBookingStep('time');
//     } else if (bookingStep === 'time') {
//       setBookingStep('date');
//       setSelectedTime(null);
//     }
//   };

//   return (
//     <div className="secure-booking-container">
//       <h1>Book Your Appointment</h1>
    
//       {/* Progress indicator */}
//       <div className="booking-progress">
//         <div className={`progress-step ${bookingStep === 'date' ? 'active' : ''}`}>
//           1. Select Date
//         </div>
//         <div className={`progress-step ${bookingStep === 'time' ? 'active' : ''}`}>
//           2. Select Time
//         </div>
//         <div className={`progress-step ${bookingStep === 'confirm' ? 'active' : ''}`}>
//           3. Confirm & Pay
//         </div>
//       </div>

//       <div className="booking-steps">
//         {bookingStep === 'date' && (
//           <DateSelector 
//             artistId={artistId} 
//             onDateSelect={handleDateSelect}
//             selectedDate={selectedDate}
//           />
//         )}
      
//         {bookingStep === 'time' && (
//           <>
//             <DateSelector 
//               artistId={artistId} 
//               onDateSelect={handleDateSelect}
//               selectedDate={selectedDate}
//             />
//             {isLoading ? (
//               <div className="loading">Loading available times...</div>
//             ) : error ? (
//               <div className="error-message">{error}</div>
//             ) : (
//               <TimeSlots 
//                 selectedDate={selectedDate}
//                 availableSlots={availableSlots}
//                 onTimeSelect={handleTimeSelect}
//                 selectedTime={selectedTime}
//               />
//             )}
//           </>
//         )}

//         {bookingStep === 'confirm' && (
//           <BookingConfirmation
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             duration={duration}
//             artistId={artistId}
//             onConfirm={handleConfirmBooking}
//             onBack={handleBack}
//             isLoading={isLoading}
//             error={error}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SecureBooking;