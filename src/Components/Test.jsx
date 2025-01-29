// import React, { useState } from 'react';

// const Test = () => {
//     const [formData, setFormData] = useState({
//         to: '',
//         subject: '',
//         text: '',
//         html: ''
//     });

//     const [responseMessage, setResponseMessage] = useState('');

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setResponseMessage('');

//         try {
//             const response = await fetch('/Api/SendEmail', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (response.ok) {
//                 setResponseMessage('Email sent successfully!');
//             } else {
//                 const errorData = await response.json();
//                 setResponseMessage(`Failed to send email: ${errorData.error || 'Unknown error'}`);
//             }
//         } catch (error) {
//             setResponseMessage(`Error: ${error.message}`);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
//             <h2>Test SendGrid Email</h2>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>To:</label>
//                     <input
//                         type="email"
//                         name="to"
//                         value={formData.to}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>Subject:</label>
//                     <input
//                         type="text"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>Text Body:</label>
//                     <textarea
//                         name="text"
//                         value={formData.text}
//                         onChange={handleChange}
//                         rows="4"
//                         style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label>HTML Body:</label>
//                     <textarea
//                         name="html"
//                         value={formData.html}
//                         onChange={handleChange}
//                         rows="4"
//                         style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//                     />
//                 </div>
//                 <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
//                     Send Email
//                 </button>
//             </form>
//             {responseMessage && (
//                 <p style={{ marginTop: '20px', color: responseMessage.includes('successfully') ? 'green' : 'red' }}>
//                     {responseMessage}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default Test;