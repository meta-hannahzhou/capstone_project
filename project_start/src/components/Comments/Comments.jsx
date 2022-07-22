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
export default function Comments({ comments, handleDeleteComment }) {
  return (
    <div className="comments">
      <div className="displayComment">
        {comments.map((currComment) => {
          return (
            <div className="indiv-comment">
              <div className="comment-text">
                <span className="bolded">{currComment.userId} </span>{" "}
                {currComment.comment}
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
