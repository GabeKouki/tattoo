import React from 'react';
import { supabase } from '../Utils/SupabaseClient';
import './Booking.css';

const Booking = () => {
  const [data, setData] = React.useState([]);

  const fetchArtists = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")

      setData(data);
    if (error) {
      throw error;
    }
    console.log("Artists:", data);
  };
  




  return (
    <div className="BookingContainer">
      <h1>Hello</h1>
      <button onClick={fetchArtists}>Fetch Artists</button>
      <div className="artist-selection">
        <h2>Select an Artist</h2>
        <div className="artist-grid">
          {data.map((artist) => (
            <div className="artist-card" key={artist.id}>
              <h3>{artist.name}</h3>
              <p>{artist.email}</p>
              <p>{artist.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;