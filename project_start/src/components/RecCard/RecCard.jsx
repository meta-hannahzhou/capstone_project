import * as React from "react";
import "./RecCard.css";

import axios from "axios";
import { useEffect, useState } from "react";

// add fetching here so that comments only render after api calls have finished
export default function RecCard({ song }) {
  console.log(song);
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
