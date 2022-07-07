import * as React from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import Pic from "./test_image.png";
import axios from "axios";

export default function Post({
  selectedSongId,
  selectedSongUrl,
  selectedSongName,
  review,
  mood,
  rating,
  userId,
  likes,
  comments,
  postId,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const comment = document.getElementById("comment").value;

    await axios.post("http://localhost:8888/new-comment", {
      postId: postId,
      selectedSongId: selectedSongId,
      comment: comment,
    });
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
                    <span className="ml-1">Likes: {likes}</span>
                  </div>
                  <div className="like p-2 cursor">
                    <i className="fa fa-commenting-o"></i>
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
                  ></textarea>
                </div>
                <div className="mt-2 text-right ">
                  <button
                    className="btn btn-primary btn-sm shadow-none post-comment"
                    type="button"
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
