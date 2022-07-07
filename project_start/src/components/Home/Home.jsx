import "./Home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../Post/Post";
import Recommendations from "../Recommendations/Recommendations";

export default function Home(props) {
  const [posts, setPosts] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const getFeed = async (e) => {
    const { data } = await axios.get("http://localhost:8888/feed");
    console.log(data);
    // setPosts(data.body.tracks.items);
  };

  useEffect(() => {
    // Makes axios get request to get individual product info
    async function getFeed() {
      setIsFetching(true);
      await axios
        .get("http://localhost:8888/feed")
        .then((allPosts) => {
          setPosts(allPosts.data);
          setIsFetching(false);
        })
        .catch((error) => {
          <h1>{error}</h1>;
        });
    }
    getFeed();
  }, []);
  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="home">
        <div className="row">
          <div className="col-sm-8">
            <h1 className="home"> Feed</h1>
            <div className="grid">
              {console.log(posts)}
              {posts.map((currPost) => {
                return (
                  <Post
                    selectedSongId={currPost.selectedSongId}
                    selectedSongUrl={currPost.selectedSongUrl}
                    selectedSongName={currPost.selectedSongName}
                    review={currPost.review}
                    mood={currPost.mood}
                    rating={currPost.rating}
                    userId={currPost.userId}
                    likes={currPost.likes}
                    comments={currPost.comments}
                    postId={currPost.objectId}
                  />
                );
              })}
            </div>
          </div>
          <Recommendations />
        </div>
      </div>
    );
  }
}
