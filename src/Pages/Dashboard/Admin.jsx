import React, { useState, useEffect } from "react";
import { fetchAllArtists, deleteArtist } from "../../Utils/dashboardUtils";
import "./Admin.css";
import Pagination from "./Pagination";
import AddArtist from "./AddArtist";

const Admin = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const lastPostIndex = currentPage * itemsPerPage;
  const firstPostIndex = lastPostIndex - itemsPerPage;
  const currentPosts = artists.slice(firstPostIndex, lastPostIndex);
  const [addingArtist, setAddingArtist] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await fetchAllArtists();
      console.log(data);
      setArtists(data);
    };
    fetchArtists();
  }, []);

  const handleDelete = async (id) => {
    const { data, error } = await deleteArtist(id);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  }

  return (
    <>
      <div className="AdminContainer">
        <div className="AdminHeader">
          <h1>Employees: </h1>
          {addingArtist ? (
            <button onClick={() => setAddingArtist(false) && fetchAllArtists()}>Cancel</button>
          ) : (
            <button onClick={() => setAddingArtist(true)}>Add Employee</button>
          )}
        </div>

        {!addingArtist && (
          <>
            <div className="CardsContainer">
              {currentPosts.map((artist) => (
                <div className="AdminCard">
                  <div className="CardHeader">
                    <img src={artist.profile_picture} alt="artist-profile" />
                    <h2>
                      {artist.first_name} {artist.last_name}
                    </h2>
                  </div>
                  <div className="CardBody">
                    <p>Role: {artist.role}</p>
                    <p>Email: {artist.email}</p>
                    <p>Phone: {artist.phone_number}</p>
                    <p>
                      Joined at:{" "}
                      {new Date(artist.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      Available Days:{" "}
                      {artist.available_days?.join(", ") || "Not specified"}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(artist.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="PaginationContainer">
              <Pagination
                totalPosts={artists.length}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          </>
        )}

        {addingArtist && <AddArtist />}
      </div>
    </>
  );
};

export default Admin;
