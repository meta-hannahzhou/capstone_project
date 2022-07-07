import './App.css';
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home"
import Navbar from "./components/Navbar/Navbar"
import Profile from "./components/Profile/Profile"
import NewPost from "./components/NewPost/NewPost"
import Statistics from "./components/Statistics/Statistics"

import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const [artists, setArtists] = useState([])
  const [newPost, setNewPost] = useState({title:"", review:"", mood: ""})
  const [isFetching, setIsFetching] = useState(false)


  

  // const displayProfile = async () => {
  //   if (!userInfo) {
  //       <div className="profile">
  //         <p>ID: {userInfo.id}</p>
  //         <p>Email: {userInfo.email}</p>
  //         <p>Profile Picture:</p>
  //         <img src={userInfo.images[0].url} />
  //       </div>
  //   } else {
  //     null;
  //   }
  // };

  // const [tracks, setTracks] = useState([])


  // const searchArtists = async (e) => {
  //   e.preventDefault()
  //   const {data} = await axios.post("http://localhost:8888/", {search: search})
  //   console.log(data)
  //   setArtists(data.body.artists.items)
  // }

  // const displayArtists = () => {
  //   return artists.map(artist => (
  //       <div key={artist.id} id="music-card">
  //         <div>
  //         {artist.images.length ? <img width={"70%"} src={artist.images[1].url} alt=""/> : <div>No Image</div>}
  //         </div>
  //         {artist.name}
  //       </div>
  //   ))
  // }


  // const handleOnSubmitNewPost = (songTitle, review, mood) => {
  //   axios.post("http://localhost:8888/new-post", {
  //     songTitle: songTitle, 
  //     review: review, 
  //     mood: mood})
  //   .then((response) => {
  //     setNewPost(response.data)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   });
  // }

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
                  
                </>
                
              }
            />

          <Route
              path="/profile"
              element={
                <>
                  <Profile 
                          // displayProfile={displayProfile()}
                          />
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

            <Route
              path="/statistics"
              element={
                <>
                  <Statistics />
                </>
                
              }
            />
        </Routes>
      

    </div>
  );
}

export default App;
