import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
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
      const response = await axios.get("http://localhost:8888/statistics");
      const currTop = response.data.body.items;
      setTop(currTop);
      setDisplaySpotify(await getGenres(currTop, false));

      const posts = await axios.get("http://localhost:8888/profile/posted/");
      setDisplayPost(await getGenres(posts.data, true));

      setIsFetching(false);
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
        <h3> Top Tracks Of All Time</h3>

        {
          <ol>
            {top.map((item) => {
              artistIds.push(item.artists[0].id);
              return <li>{item.name}</li>;
            })}
          </ol>
        }

        <div className="pie-chart">
          <h3>Spotify Statistics</h3>
          <VictoryPie
            data={displaySpotify}
            colorScale="green"
            radius={100}
            animate={{
              duration: 2000,
            }}
            style={{ labels: { fill: "white" } }}
          />
          <h3>Post Statistics</h3>
          <VictoryPie
            data={displayPost}
            colorScale="green"
            radius={100}
            style={{ labels: { fill: "white" } }}
          />
        </div>
      </div>
    );
  }
}
