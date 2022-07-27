import "./NewPost.css";
import axios from "axios";
import { useState } from "react";
import SearchSong from "../SearchSong/SearchSong";
import { baseUrl } from "../../baseUrl";

/**
 *
 * @returns Renders form for users to submit new post
 */
export default function NewPost({
  graphData,
  setGraphData,
  uniqueDates,
  setUniqueDates,
  topSongs,
  setTopSongs,
  topFeatures,
  setTopFeatures,
  combinedSongs,
  setCombinedSongs,
}) {
  const [tracks, setTracks] = useState([]);
  const [songId, setSongId] = useState("");
  const [selectedSongUrl, setSelectedSongUrl] = useState("");
  const [selectedSongName, setSelectedSongName] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");

  const searchTracks = async (e) => {
    e.preventDefault();
    if (e.target.value.length === 0) {
      setTracks([]);
    } else {
      const { data } = await axios.get(
        `${baseUrl}/post/search/${e.target.value}`
      );
      setTracks(data.body.tracks.items);
    }
  };

  const displayTracks = () => {
    return tracks.map((track) => (
      <SearchSong
        track={track}
        isActive={songId === track.id}
        onClick={() => {
          setSongId(track.id);
          setSelectedSongUrl(track.album.images[0].url);
          setSelectedSongName(track.name);
          setSelectedArtistId(track.artists[0].id);
        }}
      />
    ));
  };

  const mapMood = (mood) => {
    if (mood === "sad") {
      return -1;
    } else if (mood === "neutral") {
      return 0;
    } else {
      return 1;
    }
  };

  const mapCategory = (category) => {
    if (category === "dance") {
      return "danceability";
    } else if (category === "acoust") {
      return "acousticness";
    } else if (category === "live") {
      return "liveness";
    }
  };

  // Updating cache with top 5 songs
  const updateTop = (max, index, audioFeatures, selectedSongName, songId) => {
    const maxCategory = max[index][0];
    let copy = {};
    Object.assign(copy, topSongs);
    for (let i = 0; i < copy[maxCategory].length; i++) {
      if (
        audioFeatures[mapCategory(maxCategory)] >
        copy[maxCategory][i][maxCategory]
      ) {
        const newElement = {
          dance: audioFeatures[mapCategory("dance")],
          acoust: audioFeatures[mapCategory("acoust")],
          live: audioFeatures[mapCategory("live")],
          selectedSongName: selectedSongName,
          songId: songId,
        };
        copy[maxCategory].splice(i, 0, newElement);
        copy[maxCategory].pop();
        console.log(copy);
        break;
      }
    }
    for (let i = 0; i < copy[maxCategory].length; i++) {
      copy[maxCategory][i]["score"] =
        max[0][1] * copy[max[0][0]][i][max[0][0]] +
        max[1][1] * copy[max[1][0]][i][max[1][0]];
    }
    console.log(copy);
    setTopSongs(copy);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = document.getElementById("review").value;

    const moods = Array.prototype.slice.call(
      document.getElementsByClassName("form-check-input")
    );
    const mood = moods.find((item) => item.checked).value;

    const ratings = Array.prototype.slice.call(
      document.getElementsByClassName("form-check-input-rating")
    );
    const rating = ratings.find((rating) => rating.checked).value;

    // Reset values in form
    setTracks([]);
    document.getElementById("review").value = "";
    document.getElementById("song-title").value = "";

    for (var i = 0; i < moods.length; i++) {
      moods[i].checked = false;
    }

    for (var i = 0; i < ratings.length; i++) {
      ratings[i].checked = false;
    }

    const audioFeatures = await axios.get(
      `${baseUrl}/post/audio-features&songId=${songId}`
    );

    axios
      .post(`${baseUrl}/post/new-post-rec`, {
        audioFeatures: audioFeatures.data,
      })
      .then((max) => {
        setTopFeatures(max);
        updateTop(max.data, 0, audioFeatures.data, selectedSongName, songId);
        updateTop(max.data, 1, audioFeatures.data, selectedSongName, songId);
      });

    await axios
      .post(`${baseUrl}/post/new-post`, {
        songId: songId,
        selectedSongUrl: selectedSongUrl,
        selectedSongName: selectedSongName,
        selectedArtistId: selectedArtistId,
        review: review,
        mood: mapMood(mood),
        rating: rating,
        audioFeatures: audioFeatures.data,
      })
      .then((song) => {
        axios.post(`${baseUrl}/update-genre`, {
          updateType: "post",
          song: song,
        });
      });

    // Add date to be displayed on statistics page
    const newDate = new Date().toDateString();
    const graphDataCopy = [...graphData];

    // Look Aside Cache (updating local storage while API call being made)
    // Check if date is already in list, if it is add to dictionary
    if (uniqueDates.includes(newDate)) {
      for (let i = 0; i < graphDataCopy.length; i++) {
        if (graphDataCopy[i]["key"].toDateString() === newDate) {
          graphDataCopy[i]["b"] += 1;
          break;
        }
      }
      setGraphData(graphDataCopy);
      // Otherwise add date to list and initialize new entry in dictionary
    } else {
      const uniqueDatesCopy = [...uniqueDates];
      uniqueDatesCopy.push(newDate);
      setUniqueDates(uniqueDatesCopy);
      graphDataCopy.push({ key: new Date(newDate), b: 1 });
      setGraphData(graphDataCopy);
    }
  };

  return (
    <div className="new-post">
      <h1> New Post</h1>

      <div className="all-form">
        <form className="my-form">
          <div className="form-group row">
            <label for="song title" className="col-sm-2 col-form-label">
              Song Title
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                className="form-control"
                id="song-title"
                placeholder="Song Title"
                onChange={(e) => searchTracks(e)}
              />
            </div>
          </div>

          {tracks ? <div className="">{displayTracks()}</div> : null}

          <div className="form-group row">
            <label for="review" className="col-sm-2 col-form-label">
              Review
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                className="form-control"
                id="review"
                placeholder="Review"
              />
            </div>
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
                    value="neutral"
                  />
                  <label className="form-check-label" for="gridRadios3">
                    Neutral
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
                className="btn-submit"
                id="submit"
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
    </div>
  );
}
