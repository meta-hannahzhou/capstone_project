import "./Profile.css";
import axios from "axios";
import Post from "../Post/Post";
import { baseUrl } from "../../baseUrl";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

/**
 *
 * @param {userObjectId}
 * @returns Profile displaying recent posts and basic user info
 */
export default function Profile({ userObjectId, combinedSongs }) {
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
        <h1 className="loading-text">Loading</h1>
        <ReactLoading type={"bars"} />
      </div>
    );
  } else {
    return (
      <div className="recent">
        <div className="profile-header">
          {userInfo ? (
            <div className="profile">
              <div className="prof-wrapper">
                <img
                  src={userInfo.images && userInfo.images[0].url}
                  className="prof-pic"
                />
              </div>
              <div className="prof-text">
                <h3 className="bolded">{userInfo.id}</h3>
                <p className="gotham-text bolded">{userInfo.email}</p>
                <p>
                  {" "}
                  Liked Posts - {liked.length} Commented Posts - {liked.length}
                </p>
              </div>
            </div>
          ) : null}

          {Object.keys(combinedSongs).length != 0 ? (
            <div className="user-based-recs">
              <h4 className="bolded"> User Based Recs</h4>
              <ol className="user-rec-list">
                {combinedSongs.map((item) => {
                  return <li>{item.selectedSongName}</li>;
                })}
              </ol>
            </div>
          ) : null}
        </div>
        <div className="grid-profile">
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
