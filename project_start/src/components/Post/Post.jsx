import * as React from "react";
import "./Post.css";
import { Link } from "react-router-dom";

export default function Post(props) {
  return (
    <div className="post">
      <div className="element-image">
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
      </div>

      {/* <div className="buttons">
        <button
          className="add"
          onClick={() => {
            props.handleAddItemToCart(props.productId);
          }}
        >
          +
        </button>
        <button
          className="remove"
          onClick={() => {
            props.handleRemoveItemFromCart(props.productId);
          }}
        >
          -
        </button>
      </div> */}
    </div>
  );
}
