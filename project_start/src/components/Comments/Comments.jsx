import * as React from "react";
import "./Comments.css";
import Bin from "./bin.png";
import axios from "axios";
import { baseUrl } from "../../baseUrl";

/**
 *
 * @param {comments}
 * @returns All comments under each post
 */
export default function Comments({ comments, postId }) {
  const handleDeleteComment = async (commentObjectId) => {
    await axios.delete(
      `${baseUrl}/post/${postId}/delete-comment&commentObjectId=${commentObjectId}`
    );
  };

  return (
    <div className="comments">
      <p className="comment-header">Comments:</p>
      <div className="displayComment">
        {comments.map((currComment) => {
          console.log(currComment);
          return (
            <div className="indiv-comment">
              <div className="comment-text">
                {currComment.userId}: {currComment.comment}
              </div>
              <button className="delete" onClick={(e) => {}}>
                <img className="delete-img" src={Bin} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
