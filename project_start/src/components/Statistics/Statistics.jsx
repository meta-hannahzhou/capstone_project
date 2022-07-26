import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { VictoryPie } from "victory-pie";
import { VictoryBoxPlot } from "victory-box-plot";
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis,
} from "victory";

import { baseUrl } from "../../baseUrl";

import ReactLoading from "react-loading";

export default function Statistics({ getGenres, graphData, setGraphData }) {
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

  const [zoomDomain, setZoomDomain] = useState({
    x: [new Date(2022, 5, 1), new Date(2022, 12, 1)],
  });

  const handleZoom = (domain) => {
    setZoomDomain(domain);
  };

  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: "white",
          fontSize: 10,
        },
      },
    },
  };

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
        <h1>Loading</h1>
        <ReactLoading type={"bars"} />
      </div>
    );
  } else {
    return (
      <div className="statistics">
        <h1> Statistics</h1>

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
                  <div className="top-list">
                    <h4>Top Tracks Of {title}</h4>
                    <div class="dropdown">
                      <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Time Frame
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className="dropdown-item"
                          id="long_term"
                          onClick={(e) => {
                            handleTime(e);
                          }}
                        >
                          All Time
                        </a>
                        <a
                          className="dropdown-item"
                          id="medium_term"
                          onClick={(e) => {
                            handleTime(e);
                          }}
                        >
                          Last 6 Months
                        </a>
                        <a
                          className="dropdown-item"
                          id="short_term"
                          onClick={(e) => {
                            handleTime(e);
                          }}
                        >
                          Last Month
                        </a>
                      </div>
                    </div>
                  </div>

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

        <div className="pie-chart">
          <h3>Post Genres</h3>
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

        <div className="line-graph">
          <h3>Posts Over Time</h3>
          <VictoryChart
            width={1000}
            height={350}
            scale={{ x: "time" }}
            theme={chartTheme}
            style={{
              data: { stroke: "#1db954" },
            }}
            containerComponent={
              <VictoryZoomContainer
                zoomDimension="x"
                zoomDomain={zoomDomain}
                onZoomDomainChange={handleZoom.bind(zoomDomain)}
              />
            }
          >
            <VictoryLine
              style={{
                data: { stroke: "#1db954" },
              }}
              data={graphData}
              x="key"
              y="b"
            />
          </VictoryChart>
          <VictoryChart
            padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
            width={500}
            height={100}
            scale={{ x: "time" }}
            theme={chartTheme}
            containerComponent={
              <VictoryBrushContainer
                brushDimension="x"
                brushDomain={zoomDomain}
                onBrushDomainChange={handleZoom.bind(zoomDomain)}
              />
            }
          >
            <VictoryAxis
              theme={chartTheme}
              tickFormat={(x) => new Date(x).toDateString()}
            />
            <VictoryLine
              style={{
                data: { stroke: "#1db954" },
              }}
              data={graphData}
              x="key"
              y="b"
            />
          </VictoryChart>
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
