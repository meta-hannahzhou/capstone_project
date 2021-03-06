import * as React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

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
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/profile" className="nav-link  ">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/new-post" className="nav-link  ">
                New Post
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/statistics" className="nav-link ">
                Statistics
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
