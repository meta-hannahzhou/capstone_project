import "./Statistics.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Statistics(props) {
  const [isFetching, setIsFetching] = useState(false);
  const [top, setTop] = useState({});

  // const getProfile = async () => {
  //   const { data } = await axios.get("http://localhost:8888/profile", {});
  //   props.setUserInfo(data.body);
  // };

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getTop() {
      setIsFetching(true);
      await axios
        .get("http://localhost:8888/statistics")
        .then((response) => {
          console.log(response);
          setTop(response.data.body);
          setIsFetching(false);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    getTop();
  }, []);

  return (
    <div className="statistics">
      <h1> Statistics</h1>
    </div>
  );
}
