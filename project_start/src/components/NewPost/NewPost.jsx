import "./NewPost.css";
import Search from "../Search/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchSong from "../SearchSong/SearchSong";

export default function NewPost() {
  const [tracks, setTracks] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState("");

  const searchTracks = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:8888/", {
      search: e.target.value,
    });
    setTracks(data.body.tracks.items);
  };

  const displayTracks = () => {
    return tracks.map((track) => (
      <SearchSong
        track={track}
        isActive={selectedSongId == track.id}
        onClick={() => {
          setSelectedSongId(track.id);
        }}
      />
    ));
  };

  return (
    <div className="new-post">
      <h1> New Post</h1>

      {/* <Search searchArtists={searchArtists} setSearch={setSearch} /> */}
      <form>
        <div className="form-group row">
          <label for="inputEmail3" className="col-sm-2 col-form-label">
            Song Title
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputEmail3"
              placeholder="Song Title"
              onChange={(e) => searchTracks(e)}
            />
          </div>
        </div>
      </form>

      {tracks ? <div className="">{displayTracks()}</div> : null}

      <form>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Review</span>
          </div>
          <input className="form-control" aria-label="With textarea" />
        </div>

        <fieldset className="form-group">
          <div className="row">
            <legend className="col-form-label col-sm-2 pt-0">Mood</legend>
            <div className="col-sm-10">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  value="option1"
                />
                <label className="form-check-label" for="gridRadios1">
                  Happy
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  value="option2"
                />
                <label className="form-check-label" for="gridRadios2">
                  Sad
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios3"
                  value="option3"
                />
                <label className="form-check-label" for="gridRadios3">
                  Angry
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Rating
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">
              1
            </a>
            <a className="dropdown-item" href="#">
              2
            </a>
            <a className="dropdown-item" href="#">
              3
            </a>
            <a className="dropdown-item" href="#">
              4
            </a>
            <a className="dropdown-item" href="#">
              5
            </a>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-10">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {}}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
