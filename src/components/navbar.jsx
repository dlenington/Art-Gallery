import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  // console.log(user.name);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Vidly
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="navbar-nav">
        <NavLink className="nav-item nav-link" to="/">
          Movies
        </NavLink>
        <NavLink className="nav-item nav-link" to="/">
          Customers
        </NavLink>
        <NavLink className="nav-item nav-link" to="/">
          Rentals
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
