import * as React from "react";
import "./Comments.css";

/**
 *
 * @param {comments}
 * @returns All comments under each post
 */
export default function Comments({ comments }) {
  return (
    <div className="comments">
      <p className="comment-header">Comments:</p>
      <div className="displayComment">
        {comments.map((currComment) => {
          return (
            <div className="indiv-comment">
              {currComment.userId}: {currComment.comment}
            </div>
          );
        })}
      </div>
    </div>
  );
}
