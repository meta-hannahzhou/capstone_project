import "./NewPost.css";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchSong from "../SearchSong/SearchSong";

export default function NewPost() {
  const [tracks, setTracks] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [selectedSongUrl, setSelectedSongUrl] = useState("");
  const [selectedSongName, setSelectedSongName] = useState("");

  const searchTracks = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:8888/search", {
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
          setSelectedSongUrl(track.album.images[1].url);
          setSelectedSongName(track.name);
        }}
      />
    ));
  };

  const handleSubmit = async () => {
    const review = document.getElementById("review").value;

    const moods = Array.prototype.slice.call(
      document.getElementsByClassName("form-check-input")
    );
    const mood = moods.find((item) => item.checked).value;

    const ratings = Array.prototype.slice.call(
      document.getElementsByClassName("form-check-input-rating")
    );
    const rating = ratings.find((rating) => rating.checked).value;

    await axios.post("http://localhost:8888/new-post", {
      selectedSongId: selectedSongId,
      selectedSongUrl: selectedSongUrl,
      selectedSongName: selectedSongName,
      review: review,
      mood: mood,
      rating: rating,
    });
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

        {tracks ? <div className="">{displayTracks()}</div> : null}

        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Review</span>
          </div>
          <input
            className="form-control"
            aria-label="With textarea"
            id="review"
          />
        </div>

        <fieldset className="form-group" id="mood">
          <div className="row">
            <legend className="col-form-label col-sm-2 pt-0">Mood</legend>
            <div className="inputs">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  value="happy"
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
                  value="sad"
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
                  value="angry"
                />
                <label className="form-check-label" for="gridRadios3">
                  Angry
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="form-group-new">
          <div className="row">
            <legend className="col-form-label col-sm-2 pt-0">Rating</legend>
            <div className="inputs">
              <div className="form-check">
                <input
                  className="form-check-input-rating"
                  type="radio"
                  name="gridRadios-2"
                  id="gridRadios1"
                  value="1"
                />
                <label className="form-check-label" for="gridRadios1">
                  1
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input-rating"
                  type="radio"
                  name="gridRadios-2"
                  id="gridRadios2"
                  value="2"
                />
                <label className="form-check-label" for="gridRadios2">
                  2
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input-rating"
                  type="radio"
                  name="gridRadios-2"
                  id="gridRadios3"
                  value="3"
                />
                <label className="form-check-label" for="gridRadios3">
                  3
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input-rating"
                  type="radio"
                  name="gridRadios-2"
                  id="gridRadios3"
                  value="4"
                />
                <label className="form-check-label" for="gridRadios3">
                  4
                </label>
              </div>
              <div className="form-check ">
                <input
                  className="form-check-input-rating"
                  type="radio"
                  name="gridRadios-2"
                  id="gridRadios3"
                  value="5"
                />
                <label className="form-check-label" for="gridRadios3">
                  5
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="form-group row">
          <div className="col-sm-10">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}