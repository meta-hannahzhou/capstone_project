import * as React from "react";
import "./Navbar.css";
// import { Link, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-links">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <Link to="/home" class="nav-link active ">
                Home
              </Link>
            </li>

            <li class="nav-item">
              <Link to="/recent" class="nav-link  ">
                Recent Activity
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/new-post" class="nav-link  ">
                New Post
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/statistics" class="nav-link ">
                Statistics
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// {
//     <div className="nav-element">
//       <a className="anchor" href={"#about-us"}>
//         About Us
//       </a>
//       <a className="anchor" href={"#contact-us"}>
//         Contact Us
//       </a>
//       {/* <Link to="/orders" className="orders">
//         {" "}
//         Orders
//       </Link> */}
//     </div>
//   }
