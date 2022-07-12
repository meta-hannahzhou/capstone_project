import * as React from "react";
import "./RecCard.css";

// add fetching here so that comments only render after api calls have finished
export default function RecCard({ song }) {
  return (
    <div className="rec-card">
      <img src={song.album.images[1].url} className="rec" />
      <div className="description">
        <div>{song.name}</div>
        <div>{song.artists[0].name}</div>
      </div>
    </div>
  );
}
