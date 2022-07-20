import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { VictoryPie } from "victory-pie";
import { VictoryBoxPlot } from "victory-box-plot";
import { VictoryChart } from "victory-chart";
import { baseUrl } from "../../baseUrl";
import ReactLoading from "react-loading";

export default function Statistics({ getGenres }) {
  const [isFetching, setIsFetching] = useState(true);
  const [displaySpotify, setDisplaySpotify] = useState([]);
  const [displayPost, setDisplayPost] = useState([]);
  const [top, setTop] = useState({});
  const [endAngle, setEndAngle] = useState(0);
  const [time, setTime] = useState("long_term");
  const [isChanging, setIsChanging] = useState(false);
  const [title, setTitle] = useState("All Time");
  const [moods, setMoods] = useState([]);
  const [allMoods, setAllMoods] = useState([]);

  let artistIds = [];
  const handleTime = async (e) => {
    setIsChanging(true);
    setTime(e.currentTarget.id);
    if (e.currentTarget.id === "short_term") {
      setTitle("Last Month");
    } else if (e.currentTarget.id === "medium_term") {
      setTitle("Last 6 Months");
    } else {
      setTitle("All Time");
    }
    const response = await axios.get(
      `${baseUrl}/statistics/${e.currentTarget.id}`
    );
    const currTop = response.data.body.items;
    setTop(currTop);
    setDisplaySpotify(await getGenres(currTop, false));
    setIsChanging(false);
  };

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getTop() {
      setIsFetching(true);
      const response = await axios.get(`${baseUrl}/statistics/${time}`);
      const currTop = response.data.body.items;
      setTop(currTop);
      setDisplaySpotify(await getGenres(currTop, false));

      const posts = await axios.get(`${baseUrl}/profile/posted/`);
      setDisplayPost(await getGenres(posts.data, true));

      const result = await axios.get(`${baseUrl}/statistics/moods`);

      setMoods(result.data.moods);
      setAllMoods(result.data.allMoods);

      setIsFetching(false);

      setTimeout(() => {
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
        <div className="stat-buttons">
          <button
            className="time-select"
            type="button"
            id="long_term"
            onClick={(e) => {
              handleTime(e);
            }}
          >
            All Time
          </button>

          <button
            className="time-select"
            type="button"
            id="medium_term"
            onClick={(e) => {
              handleTime(e);
            }}
          >
            Last 6 Months
          </button>

          <button
            className="time-select"
            type="button"
            id="short_term"
            onClick={(e) => {
              handleTime(e);
            }}
          >
            Last Month
          </button>
        </div>

        <div className="top">
          <>
            {isChanging ? (
              <div className="loading">
                <h3>Loading</h3>
                <ReactLoading type={"bars"} />
              </div>
            ) : (
              <>
                <div className="list">
                  <h3> Top Tracks Of {title}</h3>

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
                </div>{" "}
              </>
            )}
          </>
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
        <h3>Mood</h3>

        <h4>You:</h4>
        <VictoryBoxPlot
          horizontal
          data={[{ x: 1, y: moods }]}
          height={80}
          labels
          style={{
            min: { stroke: "#1db954" },
            max: { stroke: "white" },
            q1: { fill: "#1db954" },
            q3: { fill: "white" },
            median: { stroke: "white", strokeWidth: 2 },
            minLabels: { fill: "#1db954" },
            maxLabels: { fill: "white" },
          }}
        />
        <h4>The World:</h4>
        <VictoryBoxPlot
          horizontal
          data={[{ x: 1, y: allMoods }]}
          height={80}
          labels
          style={{
            min: { stroke: "#1db954" },
            max: { stroke: "white" },
            q1: { fill: "#1db954" },
            q3: { fill: "white" },
            median: { stroke: "white", strokeWidth: 2 },
            minLabels: { fill: "#1db954" },
            maxLabels: { fill: "white" },
          }}
        />
      </div>
    );
  }
}
