import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ status }) => {
  const steps = [
    { id: 1, label: 'Inquiry Approved', completed: status === 'approved' || status === 'scheduled' || status === 'confirmed' },
    { id: 2, label: 'Appointment Scheduled', completed: status === 'scheduled' || status === 'confirmed' },
    { id: 3, label: 'Artist Review', completed: status === 'confirmed' },
    { id: 4, label: 'Artist Approved', completed: status === 'confirmed' },
  ];

  return (
    <div className="ProgressTracker">
      {steps.map((step, index) => (
        <div key={step.id} className={`ProgressStep ${step.completed ? 'completed' : ''}`}>
          <div className="StepCircle">{index + 1}</div>
          <div className="StepLabel">{step.label}</div>
          {index < steps.length - 1 && <div className="StepConnector"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
