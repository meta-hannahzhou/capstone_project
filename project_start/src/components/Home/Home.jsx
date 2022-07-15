import "./Home.css";
import axios from "axios";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Post from "../Post/Post";
import Recommendations from "../Recommendations/Recommendations";
import ReactLoading from "react-loading";

export const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

export const useEffectOnceLayout = (effect) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useLayoutEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

/**
 *
 * @param {userObjectId, setUserObjectId, getGenres}
 * @returns Renders home page and recommendations sidebar asynchronously
 */
export default function Home({ userObjectId, setUserObjectId, getGenres }) {
  const [posts, setPosts] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffectOnce(() => {
    async function getProfile() {
      setIsFetching(true);
      const response = await axios.post("http://localhost:8888/");
      setUserObjectId(response.data.objectId);
    }

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
    getProfile();
    getFeed();
  }, []);

  // useEffectOnce(() => {
  //   const time = setTimeout(() => {
  //     window.onSpotifyIframeApiReady = (IFrameAPI) => {
  //       let element = document.getElementById("embed-iframe");
  //       console.log(element);
  //       let options = {
  //         width: "60%",
  //         height: "200",
  //         uri: "spotify:episode:7makk4oTQel546B0PZlDM5",
  //       };
  //       let callback = (EmbedController) => {
  //         document
  //           .querySelectorAll("ul#episodes > li > button")
  //           .forEach((episode) => {
  //             episode.addEventListener("click", () => {
  //               EmbedController.loadUri(episode.dataset.spotifyId);
  //             });
  //           });
  //       };
  //       IFrameAPI.createController(element, options, callback);
  //     };

  //     clearTimeout(time);
  //   }, 5000);
  // }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading</h1>
        <ReactLoading type={"bars"} />
      </div>
    );
  } else {
    return (
      <div className="home">
        {/* <div id="embed-iframe">hi</div> */}
        {/*
        <script
          src="https://open.spotify.com/embed-podcast/iframe-api/v1"
          async
        ></script>
        {
          (window.onSpotifyIframeApiReady = (IFrameAPI) => {
            let element = document.getElementById("embed-iframe");
            let options = {
              width: "60%",
              height: "200",
              uri: "spotify:episode:7makk4oTQel546B0PZlDM5",
            };
            let callback = (EmbedController) => {
              document
                .querySelectorAll("ul#episodes > li > button")
                .forEach((episode) => {
                  episode.addEventListener("click", () => {
                    EmbedController.loadUri(episode.dataset.spotifyId);
                  });
                });
            };
            IFrameAPI.createController(element, options, callback);
          })
        } */}
        <div className="row">
          <div className="col-sm-8">
            <div className="grid">
              {posts.map((currPost) => {
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
                    isProfile={false}
                  />
                );
              })}
            </div>
          </div>
          <Recommendations getGenres={getGenres} userObjectId={userObjectId} />
        </div>
      </div>
    );
  }
}
