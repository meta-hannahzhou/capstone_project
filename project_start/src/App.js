import './App.css';
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home/Home"
import Navbar from "./components/Navbar/Navbar"
import Profile from "./components/Profile/Profile"
import NewPost from "./components/NewPost/NewPost"
import Statistics from "./components/Statistics/Statistics"

/**
 * Sets up all routes for basic pages that can be navigated to from navbar
 */
function App() {

  const [userObjectId, setUserObjectId] = useState("")

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
          `http://localhost:8888/genre/${item.artists[0].id}`
        );
        return currGenres.data;
      } else {
        const currGenres = await axios.get(
          `http://localhost:8888/post-genre/${item.selectedSongId}`
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
  return (
    // make this blank route
    <div className="App">
      

      <Routes>
        
        <Route 
          path="/"
          element = {
            <header className="App-header">
              <a
                className="App-link"
                href="http://localhost:8888/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login to Spotify!
              </a>
            </header>
          }
          />

        <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home userObjectId={userObjectId}
                      setUserObjectId={setUserObjectId}
                      getGenres={getGenres}/>
              </>
              
            }
          />

        <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile userObjectId={userObjectId}
                         setUserObjectId={setUserObjectId}/>
              </>
              
            }
          />

          <Route
            path="/new-post"
            element={
              <>
                <Navbar />
                <NewPost />
              </>
              
            }
          />

          <Route
            path="/statistics"
            element={
              <>
                <Navbar />
                <Statistics getGenres={getGenres}/>
              </>
              
            }
          />
      </Routes>
  
    </div>
  );
}

export default App;
