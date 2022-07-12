import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../Post/Post";

export default function Profile({ userObjectId, setUserObjectId }) {
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [liked, setLiked] = useState([]);
  const [posted, setPosted] = useState([]);
  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getProfile() {
      setIsFetching(true);
      await axios
        .get(`http://localhost:8888/profile`)
        .then((response) => {
          setUserInfo(response.data.body);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    async function getLiked() {
      await axios
        .get(`http://localhost:8888/profile/liked/${userObjectId}`)
        .then((response) => {
          setLiked(response.data.result);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    async function getPosted() {
      setIsFetching(true);
      await axios
        .get(`http://localhost:8888/profile/posted`)
        .then((response) => {
          setPosted(response.data);
          setIsFetching(false);
        })
        .catch((error) => {
          <h1>Bad</h1>;
        });
    }
    getProfile();
    getLiked();
    getPosted();
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
              <p>Number of Liked Posts: {liked.length}</p>
            </div>
          ) : null}
        </>
        <div className="grid">
          {posted.map((currPost) => {
            return (
              <Post
                selectedSongId={currPost.selectedSongId}
                review={currPost.review}
                mood={currPost.mood}
                rating={currPost.rating}
                userId={currPost.userId}
                postId={currPost.objectId}
                userObjectId={userObjectId}
                createdAt={currPost.createdAt}
                key={currPost.objectId}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
                isProfile={true}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
