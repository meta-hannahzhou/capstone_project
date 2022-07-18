import './App.css';
import * as React from "react";
// import Spotify from "react-spotify-embed"
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home/Home.jsx"
import Navbar from "./components/Navbar/Navbar.jsx"
import Profile from "./components/Profile/Profile.jsx"
import NewPost from "./components/NewPost/NewPost.jsx"
import Statistics from "./components/Statistics/Statistics.jsx"
import { baseUrl } from './baseUrl.js';

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
          `${baseUrl}/genre/${item.artists[0].id}`
        );
        return currGenres.data;
      } else {
        const currGenres = await axios.get(
          `${baseUrl}/post-genre/${item.selectedSongId}`
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
    console.log(process.env.VERCEL_URL)
    await axios.post(`${baseUrl}/base`, {
      baseRedirectUrl: process.env.VERCEL_URL});
  }

  
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // console.log()
      
      // console.log("being called?!")
      sendUrl()
    }
  }, []);

  const link = `${baseUrl}/login`
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
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="login-text">Login to Spotify</span>
                
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
