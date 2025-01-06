// // src/Pages/Dashboard/Inquiries.jsx
// import React, { useEffect, useState } from 'react';
// import { fetchInquiries } from '../../Utils/Inquiries';
// import './Inquiries.css'; // optional if you want custom styling

// const Inquiries = () => {
//   const [inquiries, setInquiries] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadInquiries = async () => {
//       try {
//         const data = await fetchInquiries();
//         setInquiries(data);
//       } catch (err) {
//         console.error('Error fetching inquiries:', err);
//         setError(err.message);
//       }
//     };
//     loadInquiries();
//   }, []);

//   if (error) {
//     return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
//   }

//   // If no inquiries yet or empty array
//   if (!inquiries.length) {
//     return <p style={{ textAlign: 'center' }}>No inquiries found.</p>;
//   }

//   return (
//     <div className="inquiries-container">
//       <h2>Inquiries</h2>
//       <table className="inquiries-table">
//         <thead>
//           <tr>
//             <th>Client</th>
//             <th>Email</th>
//             <th>Description</th>
//             <th>Size</th>
//             <th>Placement</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inquiries.map((inq) => (
//             <tr key={inq.id}>
//               <td>{inq.client_name}</td>
//               <td>{inq.client_email}</td>
//               <td>{inq.tattoo_description}</td>
//               <td>{inq.approximate_size}</td>
//               <td>{inq.placement}</td>
//               <td>{inq.status}</td>
//               {/* Add more columns as needed */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Inquiries;
