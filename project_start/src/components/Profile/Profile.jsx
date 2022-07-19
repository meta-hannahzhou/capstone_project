import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../Post/Post";
import { baseUrl } from "../../baseUrl";
import ReactLoading from "react-loading";

/**
 *
 * @param {userObjectId}
 * @returns Profile displaying recent posts and basic user info
 */
export default function Profile({ userObjectId }) {
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [liked, setLiked] = useState([]);
  const [posted, setPosted] = useState([]);
  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getProfile() {
      setIsFetching(true);
      const profile = await axios.get(`${baseUrl}/profile`);
      setUserInfo(profile.data.body);

      const likedPosts = await axios.get(
        `${baseUrl}/profile/liked/${userObjectId}`
      );

      setLiked(likedPosts.data);

      const posted = await axios.get(`${baseUrl}/profile/posted`);
      setPosted(posted.data);

      setIsFetching(false);
    }

    getProfile();
  }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h3>Loading</h3>
        <ReactLoading type={"bars"} />
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
                songId={currPost.songId}
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
