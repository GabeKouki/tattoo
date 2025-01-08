import React from 'react'
import { sendEmail } from '../Utils/EmailUtils';

const Test = () => {


  const handleSendEmail = () => {
    const templateParams = {
      from_name: 'John Doe',
      from_email: 'johndoe@example.com',
      tattoo_description: 'Hello, this is a test message!',
    };

    sendEmail(templateParams)
      .then((response) => {
        alert('Email sent successfully!');
      })
      .catch((error) => {
        alert('Failed to send email. Please try again later.');
      });
  };


  return (
    <div>
      <button onClick={handleSendEmail}>Test</button>
    </div>
  )
}

export default Test
