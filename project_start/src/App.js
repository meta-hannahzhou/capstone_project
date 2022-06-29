import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home"
import Search from "./components/Search/Search"
import SearchGrid from "./components/SearchGrid/SearchGrid"
import Navbar from "./components/Navbar/Navbar"
import Recent from "./components/Recent/Recent"
import NewPost from "./components/NewPost/NewPost"

import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const [search, setSearch] = useState("")
  const [artists, setArtists] = useState([])
  // const [tracks, setTracks] = useState([])

  // const handleSearch = (query) => {
  //   setSearch(query)
  // }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.post("http://localhost:8888/", {search: search})
    // console.log(data)
    setArtists(data.body.artists.items)
  }

  const displayArtists = (artists) => {
    return artists.map(artist => (
        <div key={artist.id} id="music-card">
          <div>
          {artist.images.length ? <img width={"70%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          </div>
          {artist.name}
        </div>
    ))
  }

  return (
    // make this blank route
    <div className="App">
  
      <Navbar />

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
                  <Home />
                  <Search searchArtists={searchArtists}
                         setSearch={setSearch} />
                  <SearchGrid displayArtists={displayArtists}
                              artists={artists}/>
                </>
                
              }
            />

          <Route
              path="/recent"
              element={
                <>
                  <Recent />
                </>
                
              }
            />

            <Route
              path="/new-post"
              element={
                <>
                  <NewPost />
                </>
                
              }
            />
        </Routes>
      

    </div>
  );
}

export default App;
