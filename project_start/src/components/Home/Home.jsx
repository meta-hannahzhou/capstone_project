import "./Home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../Post/Post";

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
      const allPosts = await axios.get("http://localhost:8888/feed");
      console.log(allPosts.data);
    }
    getFeed();
  }, []);

  return (
    <div className="home">
      <div className="row">
        <div className="col-sm-8">
          <h1 className="home"> Feed</h1>
          <Post />
          {/* https://bbbootstrap.com/snippets/bootstrap-like-comment-share-section-comment-box-63008805 */}
          <div className="container mt-5">
            <div className="d-flex justify-content-center row">
              <div className="col-md-8">
                <div className="d-flex flex-column comment-section">
                  <div className="p-2">
                    <div className="d-flex flex-row user-info">
                      <div className="d-flex flex-column justify-content-start ml-2">
                        <span className="d-block font-weight-bold name">
                          Marry Andrews
                        </span>
                        <span className="date text-black-50">
                          Shared publicly - Jan 2020
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex flex-row fs-12">
                      <div className="like p-2 cursor">
                        <i className="fa fa-thumbs-o-up"></i>
                        <span className="ml-1">Like</span>
                      </div>
                      <div className="like p-2 cursor">
                        <i className="fa fa-commenting-o"></i>
                        <span className="ml-1">Comment</span>
                      </div>
                      <div className="like p-2 cursor">
                        <i className="fa fa-share"></i>
                        <span className="ml-1">Share</span>
                      </div>
                    </div>
                  </div>
                  <div className=" p-2">
                    <div className="d-flex flex-row align-items-start">
                      <img
                        className="rounded-circle"
                        src="https://i.imgur.com/RpzrMR2.jpg"
                        width="40"
                      />
                      <textarea className="form-control ml-1 shadow-none textarea"></textarea>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        className="btn btn-primary btn-sm shadow-none"
                        type="button"
                      >
                        Post comment
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm ml-1 shadow-none"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <h1>Recommendations!</h1>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card">
                <img />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a longer card with supporting text below as a
                    natural lead-in to additional content. This content is a
                    little bit longer.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <img />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a longer card with supporting text below as a
                    natural lead-in to additional content. This content is a
                    little bit longer.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <img />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a longer card with supporting text below as a
                    natural lead-in to additional content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <img />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a longer card with supporting text below as a
                    natural lead-in to additional content. This content is a
                    little bit longer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
