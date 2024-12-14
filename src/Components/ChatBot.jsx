import React from 'react';
import ChatBot from 'react-simple-chatbot';

const Chatbot = () => {
  const steps = [
    {
      id: 1,
      message: "Welcome to our Tattoo Studio! How can we assist you today?",
      trigger: "2",
    },
    {
      id: 2,
      options: [
        { value: 1, label: "Book an Appointment", trigger: "3" },
        { value: 2, label: "See tattoo Styles", trigger: "4" },
        { value: 3, label: "Contact Us", trigger: "5" },
      ],
    },
    {
      id: 3,
      message: "to book an appointment, visit our booking page!",
      end: true,
    },
    {
      id: 4,
      message: "to see tattoo styles, visit our styles page!",
      end: true,
    },
    {
      id: 5,
      message: "to contact us, visit our contact page!",
      end: true,
    },
  ];

  return <Chatbot steps={steps} />;
}

export default Chatbot;