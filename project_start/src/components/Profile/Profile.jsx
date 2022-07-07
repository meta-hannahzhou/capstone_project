import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Recent(props) {
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getProfile() {
      setIsFetching(true);
      await axios
        .get("http://localhost:8888/profile")
        .then((response) => {
          setUserInfo(response.data.body);
          setIsFetching(false);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    getProfile();
  }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="recent">
        <h1> Recent</h1>
        <>
          {userInfo ? (
            <div className="profile">
              <p>Id: {userInfo.id}</p>
              <p>Email: {userInfo.email}</p>
            </div>
          ) : null}
        </>
      </div>
    );
  }
}
