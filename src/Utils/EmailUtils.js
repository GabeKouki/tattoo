import emailjs from '@emailjs/browser';

export const sendEmail = async (templateParams, artistID) => {
  let serviceId;
  let templateId;
  let publicKey;
  
  try {
    switch(artistID) {
      case 'Audrey':
        serviceId = process.env.REACT_APP_AUDREY_EMAILJS_SERVICE_ID;
        templateId = process.env.REACT_APP_AUDREY_APPOINTMENT_REQUEST_TEMPLATE_ID;
        publicKey = process.env.REACT_APP_AUDREY_EMAILJS_PUBLIC_KEY;
        break;
      case 'Shiloh':
        serviceId = process.env.REACT_APP_SHILOH_EMAILJS_SERVICE_ID;
        templateId = process.env.REACT_APP_SHILOH_APPOINTMENT_REQUEST_TEMPLATE_ID;
        publicKey = process.env.REACT_APP_SHILOH_EMAILJS_PUBLIC_KEY;
        break;
      case 'Christina':
        serviceId = process.env.REACT_APP_CHRISTINA_EMAILJS_SERVICE_ID;
        templateId = process.env.REACT_APP_CHRISTINA_APPOINTMENT_REQUEST_TEMPLATE_ID;
        publicKey = process.env.REACT_APP_CHRISTINA_EMAILJS_PUBLIC_KEY;
        break;
      default:
        throw new Error('Invalid artist ID');
    }

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey

      })
    console.log('Email sent successfully:', response);
    return response;

  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email. Please try again.');
  }
}

export const sendRejectionEmail = async ({ clientEmail, rejectionReason, clientName, artistName }) => {
  try {
    const serviceId = process.env.REACT_APP_MAIN_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_MAIN_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_MAIN_EMAILJS_PUBLIC_KEY;

    // Create template parameters to pass to the email template
    const templateParams = {
      to_email: clientEmail, // Email address of the client
      to_name: clientName, // Name of the client
      rejection_reason: rejectionReason, // Reason for rejecting the inquiry
      artist_name: artistName, // Name of the artist
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('Rejection email sent successfully:', response);
    return response;

  } catch (error) {
    console.error('Error sending rejection email:', error);
    alert('Failed to send rejection email. Please try again.');
    throw error;
  }
};
