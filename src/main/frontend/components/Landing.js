import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReviewTile from "./ReviewTile";

const Landing = (props) => {
  const [randomAlbum, setRandomAlbum] = useState({});
  const [reviews, setReviews] = useState([]);

  const altText = `a photo of ${randomAlbum.title}, an album by ${randomAlbum.artist}`;

  const getRandomAlbum = async () => {
    try {
      const response = await fetch(`/api/v1/albums/random`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const responseBody = await response.json();
      setRandomAlbum(responseBody);
      setReviews(responseBody.reviews);
    } catch (err) {
      console.error(`Error in Fetch: ${err.message}`);
    }
  };

  useEffect(() => {
    getRandomAlbum();
  }, []);

  let linkText = "";
  let albumLink = "/albums/" + randomAlbum.id;

  if (reviews.length == 0) {
    linkText = "Be the First to Review";
  } else {
    linkText = "Leave Your Own Review";
  }
  const reviewsList = reviews.map((review) => {
    return (
      <li key={review.id}>
        <ReviewTile
          id={review.id}
          rating={review.rating}
          name={review.name}
          reviewBody={review.reviewBody}
          createdAt={review.createdAt}
        />
      </li>
    );
  });

  return (
    <div>
      <video
        src="https://pitch-spork.s3.us-east-2.amazonaws.com/Main.mp4"
        autoPlay
        loop
        playsInline
        muted
      ></video>

      <div className="featuredalbum" id="featureddiv">
        <img
          src="https://pitch-spork.s3.us-east-2.amazonaws.com/featured-text.png"
          alt="text reads featured"
        />
        <br />
        <Link to={albumLink}>
          <h3>{randomAlbum.title}</h3>
          <img src={randomAlbum.coverUrl} className="featuredSize" />
        </Link>
        <h3>Artist: {randomAlbum.artist}</h3>
        <h4>Genre: {randomAlbum.genre}</h4>
        <ul>{reviewsList}</ul>
        <div>
          <Link to={albumLink}>{linkText}</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
