import './App.css';
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home"
import Navbar from "./components/Navbar/Navbar"
import Profile from "./components/Profile/Profile"
import NewPost from "./components/NewPost/NewPost"
import Statistics from "./components/Statistics/Statistics"

/**
 * Sets up all routes for basic pages that can be navigated to from navbar
 */
function App() {

  const [login, setLogin] = useState(false)

  return (
    // make this blank route
    <div className="App">
      
      <Navbar login={login}/>

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
                <Home setLogin={setLogin}/>
              </>
              
            }
          />

        <Route
            path="/profile"
            element={
              <>
                <Profile />
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
