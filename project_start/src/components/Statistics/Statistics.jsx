import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Statistics(props) {
  const [isFetchingStats, setIsFetchingStats] = useState(true);
  const [top, setTop] = useState({});

  // const getProfile = async () => {
  //   const { data } = await axios.get("http://localhost:8888/profile", {});
  //   props.setUserInfo(data.body);
  // };

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getTop() {
      setIsFetchingStats(true);
      await axios
        .get("http://localhost:8888/statistics")
        .then((response) => {
          console.log(response);
          setTop(response.data.body.items);
          setIsFetchingStats(false);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    getTop();
    console.log(top);
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
        <h1> Top Tracks Of All Time</h1>
        <>
          {
            <ol>
              {top.map((item) => (
                <li>{item.name}</li>
              ))}
            </ol>
          }
        </>
      </div>
    );
  }
}
