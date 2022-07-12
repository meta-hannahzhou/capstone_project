import "./Recommendations.css";
import axios from "axios";
import { useEffect, useState } from "react";
import RecCard from "../RecCard/RecCard";
import ReactLoading from "react-loading";

export default function Recommendations() {
  const [isFetching, setIsFetching] = useState(true);
  const [mostLiked, setMostLiked] = useState();
  const [mostCommented, setMostCommented] = useState();
  const [highestRated, setHighestRated] = useState();

  useEffect(() => {
    async function getRecs() {
      setIsFetching(true);
      const responseLike = await axios.get(
        "http://localhost:8888/recommendations/most-liked"
      );
      setMostLiked(responseLike.data.body);

      const responseComment = await axios.get(
        "http://localhost:8888/recommendations/most-commented"
      );
      setMostCommented(responseComment.data.body);

      const responseRate = await axios.get(
        "http://localhost:8888/recommendations/highest-rated"
      );
      setHighestRated(responseRate.data.body);
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
        <h1>Recommendations!</h1>
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
                <p className="card-text">
                  <RecCard song={highestRated} />
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Most Commented</h5>
                <p className="card-text">
                  <RecCard song={mostCommented} />
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <img />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
