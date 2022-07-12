import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { VictoryPie } from "victory-pie";

export default function Statistics(props) {
  const [isFetchingStats, setIsFetchingStats] = useState(true);
  const [top, setTop] = useState({});

  // const getGenres = async (e) => {
  //   e.preventDefault();
  //   const { data } = await axios.post("http://localhost:8888/search", {
  //     search: e.target.value,
  //   });
  //   setTracks(data.body.tracks.items);
  // };

  const myData = [
    { x: "Group A", y: 20 },
    { x: "Group B", y: 30 },
    { x: "Group C", y: 50 },
  ];

  let artistIds = [];
  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getTop() {
      setIsFetchingStats(true);
      await axios
        .get("http://localhost:8888/statistics")
        .then((response) => {
          setTop(response.data.body.items);
          setIsFetchingStats(false);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    getTop();
  }, []);

  if (isFetchingStats) {
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
        <>
          {
            <ol>
              {top.map((item) => {
                artistIds.push(item.artists[0].id);
                return <li>{item.name}</li>;
              })}
            </ol>
          }
        </>

        <div>
          <VictoryPie
            data={myData}
            colorScale={["blue", "yellow", "red"]}
            radius={100}
          />
        </div>
      </div>
    );
  }
}
