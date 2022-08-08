import * as React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Home from "./home.png";
import Profile from "./account.png";
import Statistic from "./statistic.png";
import NewPost from "./plus.png";

/**
 *
 * @returns Navigation bar to move around site
 */
export default function Navbar() {
  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-links">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link to="/home" className="nav-link ">
                <img src={Home} className="icon" />
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/profile" className="nav-link  ">
                <img src={Profile} className="icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/new-post" className="nav-link  ">
                <img src={NewPost} className="smaller-icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/statistics" className="nav-link ">
                <img src={Statistic} className="icon" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
