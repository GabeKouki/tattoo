import React from 'react';
import './Pages.css';

const Policies = () => {
  return (
    <div className="Page">
      <div className="PolicyContainer">
        <h1>Studio Policies</h1>
        
        <div className="PolicyContent">
          <section className="PolicySection">
            <h2>Deposits</h2>
            <ul>
              <li>$100 deposit is required to make an appointment</li>
              <li>The deposit is applied to the total cost of the tattoo</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Payment Methods</h2>
            <ul>
              <li>We accept the following payment methods:</li>
              <ul className="SecondaryList">
                <li>Cash</li>
                <li>Card</li>
                <li>PayPal</li>
                <li>Venmo</li>
              </ul>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Design Policy</h2>
            <ul>
              <li>All designs are fully customized (we specialize in custom tattoos)</li>
              <li>Designs are discussed during the session and are not shared before the appointment (to prevent misuse)</li>
              <li>We do not replicate someone else's work (designs are always tailored to the client)</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Age Requirement</h2>
            <ul>
              <li>Clients must be 18 years or older</li>
              <li>For minors:</li>
              <ul className="SecondaryList">
                <li>Must have birth certificate</li>
                <li>Must have legal guardian present</li>
              </ul>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Cancellations and Rescheduling</h2>
            <ul>
              <li>Appointments must be canceled or rescheduled at least 24 hours in advance</li>
              <li>Clients are given a 45-minute grace period before appointments are rescheduled</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Guest Policy</h2>
            <ul>
              <li>Clients may bring up to 4 guests</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Pet Policy</h2>
            <ul>
              <li>Pets are not allowed in the shop</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Behavior</h2>
            <ul>
              <li>Disrespectful or disruptive clients will be asked to leave</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Health and Safety</h2>
            <ul>
              <li>Clients must inform the shop of any:</li>
              <ul className="SecondaryList">
                <li>Skin conditions (e.g., sunburn, cuts, or irritation)</li>
                <li>Health conditions (e.g., diabetes, blood disorders)</li>
              </ul>
              <li>Clients cannot be under the influence of drugs or alcohol during their appointment</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Aftercare</h2>
            <ul>
              <li>Detailed aftercare instructions are provided to all clients</li>
              <li>The shop is not responsible if clients fail to follow aftercare instructions</li>
            </ul>
          </section>

          <section className="PolicySection">
            <h2>Photography and Social Media</h2>
            <ul>
              <li>The shop reserves the right to photograph tattoos for the artists' portfolios and social media</li>
              <li>Clients cannot opt out of having their tattoos shared online</li>
            </ul>
          </section>
        </div>
      </div>
      <div className='WhiteSpace'></div>
    </div>
  );
};

export default Policies;