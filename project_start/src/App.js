import "./App.css";
import * as React from "react";
// import Spotify from "react-spotify-embed"
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import axios from "axios";
import Home from "./components/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Profile from "./components/Profile/Profile.jsx";
import NewPost from "./components/NewPost/NewPost.jsx";
import Statistics from "./components/Statistics/Statistics.jsx";
import { baseUrl } from "./baseUrl.js";

/**
 * Sets up all routes for basic pages that can be navigated to from navbar
 */

function App() {
  const [userObjectId, setUserObjectId] = useState("");
  const [graphData, setGraphData] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [topSongs, setTopSongs] = useState({ dance: [], acoust: [], live: [] });
  const [topFeatures, setTopFeatures] = useState({});
  const [combinedSongs, setCombinedSongs] = useState({});
  /**
   *
   * @param {*} songList
   * @param {*} post
   * @returns the genres associated with a specific song
   */
  const getGenres = async (songList, post) => {
    const unresolved = songList.map(async (item) => {
      if (!post) {
        const currGenres = await axios.get(
          `${baseUrl}/genre/${item.artists[0].id}`
        );
        return currGenres.data;
      } else {
        const currGenres = await axios.get(
          `${baseUrl}/post-genre/${item.songId}`
        );
        return currGenres.data;
      }
    });
    const results = await Promise.all(unresolved);

    const finalGenres = [].concat.apply([], results);
    const unique = [...new Set(finalGenres)];
    const myData = unique.map((item) => {
      return {
        x: item,
        y: finalGenres.filter((x) => x === item).length,
      };
    });
    return myData;
  };

  const sendUrl = async () => {
    await axios.post(`${baseUrl}/frontend-url`, {
      baseRedirectUrl: window.location.href,
    });
  };

  const mapDates = (posts) => {
    let dateOnly = posts.map((post) => {
      return new Date(post.createdAt).toDateString();
    });
    const unique = [...new Set(dateOnly)];
    setUniqueDates(unique);
    const results = unique.map((item) => {
      return {
        key: new Date(item),
        b: dateOnly.filter((x) => x === item).length,
      };
    });
    return results;
  };

  const combineSort = (currTopSongs, currTopFeatures) => {
    let combined = currTopSongs[currTopFeatures[0][0]].concat(
      currTopSongs[currTopFeatures[1][0]]
    );
    combined.sort(function (first, second) {
      return second["score"] - first["score"];
    });

    let removeDuplicates = [];
    let result = [];
    for (let i = 0; i < combined.length; i++) {
      if (!removeDuplicates.includes(combined[i]["selectedSongName"])) {
        result.push(combined[i]);
        removeDuplicates.push(combined[i]["selectedSongName"]);
      }
    }
    setCombinedSongs(result);
  };

  useEffect(() => {
    async function startApp() {
      await sendUrl();
      const posts = await axios.get(`${baseUrl}/profile/posted/`);
      setGraphData(mapDates(posts.data.reverse()));

      // Initialize cache
      const results = await axios.get(`${baseUrl}/post/top-songs/`);
      const allDict = {
        dance: results.data[0],
        acoust: results.data[1],
        live: results.data[2],
      };

      // Set top songs cache
      setTopSongs(allDict);

      // Set top aatributes/features cache
      setTopFeatures(results.data[3]);
      combineSort(allDict, results.data[3]);
    }
    startApp();
  }, []);

  const link = `${baseUrl}/login`;
  return (
    // make this blank route
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <div className="login">
              <div className="login-header-top">
                Mu<span className="green">Soc</span>
              </div>
              <div className="login-header-bottom">
                (<span className="green">Soc</span>)ial Media for (Mu)sic
              </div>
              <div className="login-header-bottom">
                share, review, and find the{" "}
                <span className="green">next big song</span>
              </div>

              <div className="login-redirect">
                <header className="App-header">
                  <a
                    className="App-link"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="login-text bolded">Login to Spotify</span>
                  </a>
                </header>
              </div>
            </div>
          }
        />

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home
                userObjectId={userObjectId}
                setUserObjectId={setUserObjectId}
                getGenres={getGenres}
                topSongs={topSongs}
                topFeatures={topFeatures}
              />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile
                userObjectId={userObjectId}
                combinedSongs={combinedSongs}
              />
            </>
          }
        />

        <Route
          path="/new-post"
          element={
            <>
              <Navbar />
              <NewPost
                graphData={graphData}
                setGraphData={setGraphData}
                uniqueDates={uniqueDates}
                setUniqueDates={setUniqueDates}
                topSongs={topSongs}
                setTopSongs={setTopSongs}
                topFeatures={topFeatures}
                setTopFeatures={setTopFeatures}
                combinedSongs={combinedSongs}
                setCombinedSongs={setCombinedSongs}
                combineSort={combineSort}
              />
            </>
          }
        />

        <Route
          path="/statistics"
          element={
            <>
              <Navbar />
              <Statistics
                getGenres={getGenres}
                graphData={graphData}
                setGraphData={setGraphData}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
