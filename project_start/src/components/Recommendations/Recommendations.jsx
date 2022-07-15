import "./Recommendations.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RecCard from "../RecCard/RecCard";
import ReactLoading from "react-loading";
import { baseUrl } from "../../../baseUrl";

/**
 *
 * @param {getGenres}
 * @param {userObjectId}
 * @returns Overall display for all song recommendations
 */
export default function Recommendations({ getGenres, userObjectId }) {
  const [isFetching, setIsFetching] = useState(true);
  const [mostLiked, setMostLiked] = useState();
  const [mostCommented, setMostCommented] = useState();
  const [mostRelevant, setMostRelevant] = useState();
  const [highestRated, setHighestRated] = useState();

  const weight = (genres, type) => {
    let scale = 0;
    if (type === "post") {
      scale = 0.5;
    } else {
      scale = 0.25;
    }

    const scaledResult = genres.map((item) => {
      item.y *= scale;
      return item;
    });
    return scaledResult;
  };

  useEffect(() => {
    async function getRecs() {
      setIsFetching(true);

      // Get most liked post from all users
      const responseLike = await axios.get(
        "${baseUrl}/recommendations/most-liked"
      );
      setMostLiked(responseLike.data.body);

      // Get most commented on post from all users
      const responseComment = await axios.get(
        "${baseUrl}/recommendations/most-commented"
      );
      setMostCommented(responseComment.data.body);

      // Get highest average rated song from all users
      const responseRate = await axios.get(
        "${baseUrl}/recommendations/highest-rated"
      );
      setHighestRated(responseRate.data.body);

      // Get statistics for relevance recommendation
      const posts = await axios.get("${baseUrl}/profile/posted/");
      const postGenres = await getGenres(posts.data, true);

      const likes = await axios.get(`${baseUrl}/profile/liked/${userObjectId}`);
      const likedGenres = await getGenres(likes.data, true);

      const comments = await axios.get(
        `${baseUrl}/profile/commented/${userObjectId}`
      );
      const commentedGenres = await getGenres(comments.data, true);

      // Calculate a weighted average of the users posts, likes, and comments in relation to genres
      let scaledResult = weight(postGenres, "post").concat(
        weight(likedGenres, "like"),
        weight(commentedGenres, "comment")
      );
      const unique = [...new Set(scaledResult)];

      //https://dev.to/devtronic/javascript-map-an-array-of-objects-to-a-dictionary-3f42
      let dictionary = Object.assign({}, ...unique.map((x) => ({ [x.x]: 0 })));

      scaledResult.map((item) => {
        dictionary[item.x] += item.y;
      });

      const topGenre = Object.entries(dictionary).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      const responseRelevant = await axios.get(
        `${baseUrl}/recommendations/most-relevant/${topGenre}`
      );
      setMostRelevant(responseRelevant.data.body);

      setIsFetching(false);
    }
    getRecs();
  }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading</h1>
        <ReactLoading type={"bars"} />
      </div>
    );
  } else {
    return (
      <div className="col-sm-4">
        <h3>Recommendations</h3>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Most Liked</h5>
                <RecCard song={mostLiked} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Highest Rated</h5>
                <RecCard song={highestRated} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Most Commented</h5>
                <RecCard song={mostCommented} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Most Relevant</h5>
                <RecCard song={mostRelevant} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
