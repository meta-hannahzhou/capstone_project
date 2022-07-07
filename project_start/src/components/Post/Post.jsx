import * as React from "react";
import "./Post.css";
import Heart from "./heart.png";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Post({
  selectedSongId,
  selectedSongUrl,
  selectedSongName,
  review,
  mood,
  rating,
  userId,
  userObjectId,
  postId,
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  // need to refactor this to just add to url so it can be a get request rather than a post request
  const getComments = async () => {
    const response = await axios.post("http://localhost:8888/comments", {
      postId: postId,
    });
    console.log(postId);
    setComments(response.data);
    console.log(response.data.length);
  };

  useEffect(() => {
    getComments();
    getLikes();
  }, []);

  const handleCommentChange = async (e) => {
    setComment(e.target.value);
  };

  const handleLike = async () => {
    await axios.put("http://localhost:8888/like", {
      postId: postId,
      userObjectId: userObjectId,
    });
    getLikes();
  };

  const getLikes = async () => {
    const response = await axios.post("http://localhost:8888/get-likes", {
      postId: postId,
    });
    setLikes(response.data.likes);
  };

  const handleSubmit = async () => {
    const savedComment = await axios.post("http://localhost:8888/new-comment", {
      postId: postId,
      selectedSongId: selectedSongId,
      comment: comment,
    });
    console.log("saved!");
    await axios.put("http://localhost:8888/update-post", {
      postObjectId: postId,
      commentObjectId: savedComment.data.objectId,
    });
    console.log("updated!");
    // console.log(update);

    getComments();
  };

  return (
    <div className="post">
      <h3>{selectedSongName}</h3>
      <p>Post By: {userId}</p>
      <div className="element-image">
        <img src={selectedSongUrl} />
      </div>

      <div className="item-wrapper">
        <div className="item-review">Review: {review}</div>
        <div className="item-mood">Mood: {mood}</div>
        <div className="item-rating">Rating: {rating}/5</div>
      </div>

      {/* https://bbbootstrap.com/snippets/bootstrap-like-comment-share-section-comment-box-63008805 */}
      <div className="container mt-5">
        <div className="d-flex justify-content-center row">
          <div className="col-md-8">
            <div className="d-flex flex-column comment-section">
              <div>
                <div className="d-flex flex-row fs-12">
                  <div className="like p-2 cursor">
                    <i className="fa fa-thumbs-o-up"></i>

                    <span className="ml-1">
                      <button
                        className="like"
                        onClick={(e) => {
                          handleLike(e);
                        }}
                      >
                        <img src={Heart} className="heart" />
                      </button>
                      {likes}
                    </span>
                  </div>
                  <div className="like p-2 cursor">
                    <i className="fa fa-commenting-o"></i>
                    {/* <p>{comments}</p> */}
                    <span className="ml-1">Comments: {comments.length}</span>
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
                  <textarea
                    className="form-control ml-1 shadow-none textarea"
                    id="comment"
                    onChange={handleCommentChange}
                  ></textarea>
                </div>
                <div className="mt-2 text-right ">
                  <button
                    className="btn btn-primary btn-sm shadow-none post-comment"
                    type="button"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    Post comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
