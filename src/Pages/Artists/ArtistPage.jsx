import React, { useState, useEffect } from "react";
import "./ArtistPage.css";
import { ReactComponent as TwitterIcon } from "../../Images/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../../Images/InstagramIcon.svg";
import { ReactComponent as FacebookIcon } from "../../Images/FacebookIcon.svg";
import { useParams } from "react-router-dom";
import { fetchArtistById } from "../../Utils/dashboardUtils";
import Navbar from '../../Components/Navbar/Navbar';

const ArtistPage = () => {
  const params = useParams();
  const artistId = params.artistId;
  const [artistData, setArtistData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchArtistById(artistId);
      setArtistData(data[0]);
    };
    fetchData();
  }, []);

  const handleTest = () => {
    console.log(artistData);
    console.log(artistData.tattoo_styles[0]);
  };

  if (!artistData || !artistData.client_tattoos) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ArtistPage">
      <Navbar />
      <section className="ArtistIntro">
        <div className="ArtistProfile">
          <img src={artistData.profile_picture} alt="Audrey" className="ArtistImage" />
          <div className="ArtistInfo">
            <h1>Audrey Jenkins</h1>
            <p className="ArtistBio">
              I'm Audrey, a passionate tattoo artist specializing in creating
              unique, custom designs that reflect my clients' individuality.
            </p>
            <div className="ArtistSocials">
              <ul className="SocialLinks">
                <li>
                  <a href="instagram-link">
                    <TwitterIcon className="SocialIcon" />
                  </a>
                </li>
                <li>
                  <a href="instagram-link">
                    <InstagramIcon className="SocialIcon" />
                  </a>
                </li>
                <li>
                  <a href="instagram-link">
                    <FacebookIcon className="SocialIcon" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ArtistPortfolio">
        <h2>Portfolio</h2>
        <div className="CategoryFilter">
          {artistData.tattoo_styles.map((category) => (
            <button
              key={category}
              className={`FilterButton ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="WorkGrid">
          {artistData.client_tattoos
            .filter(
              (work) =>
                selectedCategory === "all" || work.category === selectedCategory
            )
            .map((work) => (
              <div key={work.id} className="WorkItem">
                <img src={work.image} alt={work.description} />
              </div>
            ))}
        </div>
        );
      </section>
    </div>
  );
};

export default ArtistPage;
