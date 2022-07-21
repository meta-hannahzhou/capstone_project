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
export default function Comments({ comments, postId, getComments, songId }) {
  const handleDeleteComment = async (commentId) => {
    await axios.delete(
      `${baseUrl}/post/${postId}/delete-comment&commentId=${commentId}&songId=${songId}`
    );

    await getComments();
  };

  return (
    <div className="comments">
      <p className="comment-header">Comments:</p>
      <div className="displayComment">
        {comments.map((currComment) => {
          return (
            <div className="indiv-comment">
              <div className="comment-text">
                {currComment.userId}: {currComment.comment}{" "}
              </div>
              <button
                className="delete"
                onClick={(e) => {
                  handleDeleteComment(currComment.objectId);
                }}
              >
                <img className="delete-img" src={Bin} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
