import * as React from "react";
import "./Post.css";
import Heart from "./heart.png";
import Star from "./star.png";
import CommentBubble from "./comment-bubble.png";
import HeartLiked from "./heart-liked.png";
import Comments from "../Comments/Comments";
import Mood from "../Mood/Mood";
import axios from "axios";
import Spotify from "./index.tsx";
import { useEffect, useState } from "react";
import { baseUrl } from "../../baseUrl";

/**
 *
 * @param {*}
 * @returns Individual post display for feed
 */
export default function Post({
  songId,
  review,
  mood,
  rating,
  userId,
  userObjectId,
  postId,
  createdAt,
  isFetching,
  setIsFetching,
  isProfile,
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [song, setSong] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likedObjectId, setLikedObjectId] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  // Get information about the current song being reviewed including selectedSongUrl and selectedSongName
  const getSongInfo = async () => {
    const response = await axios.get(`${baseUrl}/post/${postId}/`);
    setSong(response.data);
    setEmbedUrl(`http://open.spotify.com/track/${response.data.songId}`);
    setIsFetching(false);
  };

  /**
   * COMMENTS
   */

  // Get all comments for current post
  const getComments = async () => {
    const response = await axios.get(`${baseUrl}/post/${postId}/comments`);

    setComments(response.data);
  };

  // Update value of comment as user changes input
  const handleCommentChange = async (e) => {
    setComment(e.target.value);
  };

  // Add comment to database
  const handleSubmitComment = async (e) => {
    // Post to Comments table
    axios
      .post(`${baseUrl}/update-genre`, {
        updateType: "comment",
        songId: songId,
      })
      .then((value) => {});

    const savedComment = await axios.post(
      `${baseUrl}/post/${postId}/new-comment`,
      {
        songId: songId,
        userObjectId: userObjectId,
        comment: comment,
      }
    );

    // Update Posts datatable by appending to Comments array
    await axios.put(`${baseUrl}/post/${postId}/update-post-comment`, {
      commentId: savedComment.data.objectId,
    });
    // Call get comments to update count displayed on page
    getComments();
  };

  const handleDeleteComment = async (commentId) => {
    await axios.delete(
      `${baseUrl}/post/${postId}/delete-comment&commentId=${commentId}&songId=${songId}`
    );
    await getComments();
  };

  /**
   * LIKES
   */

  const getLikes = async () => {
    const response = await axios.get(`${baseUrl}/post/${postId}/likes`);
    setLikes(response.data);
    const test = await axios.get(
      `${baseUrl}/post/${postId}/has-liked&userObjectId=${userObjectId}`
    );

    if (test.data.length > 0) {
      setLikedObjectId(test.data);
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    // Update score
    await axios.put(`${baseUrl}/post/${postId}/score`);
  };

  // Add like to database
  const handleLike = async () => {
    if (!isLiked) {
      axios
        .post(`${baseUrl}/update-genre`, {
          updateType: "like",
          songId: songId,
        })
        .then((value) => {});

      // Update Likes Table
      const savedLike = await axios.post(`${baseUrl}/post/${postId}/new-like`, {
        songId: songId,
        userObjectId: userObjectId,
      });

      // Update Posts and Song table by appending to Likes array
      await axios.put(`${baseUrl}/post/${postId}/post-like`, {
        likeId: savedLike.data.objectId,
        isLiked: isLiked,
      });
    } else {
      await axios.delete(
        `${baseUrl}/post/${postId}/delete-like&likedObjectId=${likedObjectId}`
      );
      await axios.put(`${baseUrl}/post/${postId}/post-like`, {
        likeId: likedObjectId,
        isLiked: isLiked,
      });
    }
    // Call get likes to update likes displayed on page

    await getLikes();
  };

  useEffect(() => {
    setIsFetching(true);
    getComments();
    getLikes();
    getSongInfo();
    setIsFetching(false);
  }, []);

  if (isFetching) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="post">
        <p className="song-title">{song.selectedSongName}</p>
        <div className="element-image">
          <img className="actual-image" src={song.selectedSongUrl} />
        </div>
        <div>{embedUrl ? <Spotify wide link={embedUrl} /> : null}</div>

        <div className="box">
          <div className="like p-2 cursor">
            <i className="fa fa-thumbs-o-up"></i>

            <span className="ml-1">
              <button
                className="like"
                onClick={(e) => {
                  handleLike(e);
                }}
              >
                {isLiked ? (
                  <img src={HeartLiked} className="heart" />
                ) : (
                  <img src={Heart} className="heart" />
                )}
              </button>
              {likes.length}
            </span>
          </div>
          {}
          <div className="like p-2 cursor">
            <i className="fa fa-commenting-o"></i>
            <span className="ml-1">
              <img src={CommentBubble} className="comment" />
              <span className="comment-text">{comments.length}</span>
            </span>
          </div>
          <div className="star">
            <img src={Star} className="star-img" />
            <span className="rating">{rating}</span>
          </div>

          <Mood mood={mood} />
        </div>

        <div className="item-wrapper">
          <div className="item-review">
            <span className="bolded">{userId}</span> {review}
          </div>
        </div>
        {isProfile ? null : (
          <Comments
            comments={comments}
            handleDeleteComment={handleDeleteComment}
          />
        )}
        {/* https://bbbootstrap.com/snippets/bootstrap-like-comment-share-section-comment-box-63008805 */}

        {isProfile ? null : (
          <>
            <div className="submit-comment">
              <div className="form-group">
                <div className="textarea">
                  <input
                    type="text"
                    className="form-control"
                    id="comment"
                    placeholder="Add a comment..."
                    onChange={handleCommentChange}
                  />
                  <div className="submit-button ">
                    <button
                      className="btn btn-primary btn-sm post-comment"
                      type="button"
                      onClick={(e) => {
                        handleSubmitComment(e);
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
