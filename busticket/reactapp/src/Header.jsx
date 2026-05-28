import React from "react";
import { Link } from "react-router-dom";   // ✅ Import Link
import "./Header.css";

const Header = ({ isLoggedIn, onLoginClick, onLogoutClick }) => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav_logo">Red Bus Ticket Booking</Link>

        <ul className="nav_items">
          <li className="nav_item">
            <Link to="/home" className="nav_link">Home</Link>
            <Link to="/bookings" className="nav_link">Bookings</Link>
            <Link to="/bus" className="nav_link">Bus Ticket</Link>
            <Link to="/schedule" className="nav_link">Schedules</Link>
            <Link to="/route" className="nav_link">Route</Link>
          </li>
        </ul>

        {!isLoggedIn ? (
          <button className="button" onClick={onLoginClick}>
            Login
          </button>
        ) : (
          <button className="button" onClick={onLogoutClick}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
