import "./Recommendations.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import RecCard from "../RecCard/RecCard";
import ReactLoading from "react-loading";
import { baseUrl } from "../../baseUrl";

/**
 *
 * @param {getGenres}
 * @param {userObjectId}
 * @returns Overall display for all song recommendations
 */
export const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

export default function Recommendations({ topSongs, topFeatures }) {
  const [isFetching, setIsFetching] = useState(true);
  const [mostLiked, setMostLiked] = useState("");
  const [mostCommented, setMostCommented] = useState("");
  const [mostRelevant, setMostRelevant] = useState("");
  const [mostGenre, setMostGenre] = useState("");
  const [highestRated, setHighestRated] = useState("");

  const combineSort = () => {
    let combined = topSongs[topFeatures[0][0]].concat(
      topSongs[topFeatures[1][0]]
    );
  };

  useEffectOnce(() => {
    async function getRecs() {
      setIsFetching(true);

      // Get most liked post from all users
      axios
        .get(`${baseUrl}/recommendations/most-liked`)
        .then((responseLike) => {
          setMostLiked(responseLike.data);
        });

      // Get most commented on post from all users
      axios
        .get(`${baseUrl}/recommendations/most-commented`)
        .then((responseComment) => {
          setMostCommented(responseComment.data.body);
        });

      // Get highest average rated song from all users
      axios
        .get(`${baseUrl}/recommendations/highest-rated`)
        .then((responseRate) => {
          setHighestRated(responseRate.data.body);
        });

      // Get most popular song within a certain genre
      const topGenre = await axios.get(`${baseUrl}/recommendations/top-genre`);
      axios
        .get(`${baseUrl}/recommendations/most-genre/${topGenre.data}`)
        .then((responseGenre) => {
          setMostGenre(responseGenre.data.body);
        });

      axios
        .get(`${baseUrl}/recommendations/most-relevant`)
        .then((responseRelevance) => {
          setMostRelevant(responseRelevance.data.body);
        });
    }
    getRecs();
  }, []);

  if (
    mostLiked == "" ||
    mostCommented == "" ||
    highestRated === "" ||
    mostRelevant === "" ||
    mostGenre === ""
  ) {
    return (
      <div className="loading">
        <h1>Loading</h1>
        <ReactLoading type={"bars"} />
      </div>
    );
  } else {
    return (
      <>
        <div className="col-sm-4">
          <h3>Recommendations</h3>
          {topSongs["dance"].length === 0 ? null : null}
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
                  <h5 className="card-title">Genre Specific</h5>
                  <RecCard song={mostGenre} />
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <img />
                <div className="card-body">
                  <h5 className="card-title">General Relevance</h5>
                  <RecCard song={mostRelevant} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
