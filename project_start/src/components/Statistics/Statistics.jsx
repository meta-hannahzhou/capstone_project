import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { VictoryPie } from "victory-pie";

export default function Statistics({ getGenres }) {
  const [isFetching, setIsFetching] = useState(true);
  const [displaySpotify, setDisplaySpotify] = useState([]);
  const [displayPost, setDisplayPost] = useState([]);
  const [top, setTop] = useState({});
  const [endAngle, setEndAngle] = useState(0);

  let artistIds = [];

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getTop() {
      setIsFetching(true);
      const response = await axios.get("${baseUrl}/statistics");
      const currTop = response.data.body.items;
      setTop(currTop);
      setDisplaySpotify(await getGenres(currTop, false));

      const posts = await axios.get("${baseUrl}/profile/posted/");
      setDisplayPost(await getGenres(posts.data, true));

      setIsFetching(false);

      setTimeout(() => {
        // setDisplaySpotify(await getGenres(currTop, false));
        // setDisplayPost(await getGenres(posts.data, true));
        setEndAngle(360);
      }, 100);
    }

    getTop();
  }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="statistics">
        <h1> Statistics</h1>
        <div className="top">
          <div className="list">
            <h3> Top Tracks Of All Time</h3>

            {
              <ol>
                {top.map((item) => {
                  artistIds.push(item.artists[0].id);
                  return <li>{item.name}</li>;
                })}
              </ol>
            }
          </div>
          <div className="pie-chart">
            <VictoryPie
              data={displaySpotify}
              colorScale="green"
              radius={100}
              animate={{
                duration: 2000,
              }}
              style={{ labels: { fill: "white" } }}
              endAngle={endAngle}
            />
          </div>
        </div>

        <h3>Post Statistics</h3>
        <div className="pie-chart">
          <VictoryPie
            data={displayPost}
            colorScale="green"
            radius={100}
            style={{ labels: { fill: "white" } }}
            animate={{
              duration: 2000,
            }}
            endAngle={endAngle}
          />
        </div>
      </div>
    );
  }
}
