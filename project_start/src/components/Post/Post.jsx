import * as React from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import Pic from "./test_image.png";

export default function Post(props) {
  return (
    <div className="post">
      <div className="element-image">
        <img src={Pic} />
      </div>

      <div className="item-wrapper">
        <p className="item-title">Test</p>
        <div className="item-review">This song is great! I love it!</div>
      </div>
      {/* <div className="element-image">
        <Link
          to={`/posts/${props.postId}`}
          className="test"
          onClick={() => props.setIsFetching(true)}
        >
          <img src={props.image}></img>
        </Link>
      </div>

      <div className="item-wrapper">
        <p className="item-title">{props.title}</p>
        <div className="item-review">
          {props.review.length != 0 ? (
            <>
              <p>{props.review}</p>
            </>
          ) : null}
        </div>
      </div> */}
    </div>
  );
}
