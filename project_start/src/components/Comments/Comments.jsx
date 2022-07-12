import * as React from "react";
import "./Comments.css";

import axios from "axios";
import { useEffect, useState } from "react";

// add fetching here so that comments only render after api calls have finished
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
