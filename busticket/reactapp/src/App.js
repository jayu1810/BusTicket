import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Auth from "./Auth";
import Home from "./Home";
import "./App.css";
import BusRoutes from "./BusRoutes";
import Bookings from "./Bookings";
import BusTicket from "./BusTicket";
import Schedules from "./Schedules"
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/home"); // go to dashboard after login
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    navigate("/home"); // go to dashboard after signup
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login"); // redirect to login after logout
  };

  return (
    <div className="app_bg">
      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => navigate("/login")}
        onLogoutClick={handleLogout}
      />
      <div className="cont">
      {/* Routes */}
      <Routes>
        {/* Default redirect */}
        <Route
          path="/"
          element={!isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />

        {/* Login / Auth route */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Auth onLogin={handleLogin} onSignup={handleSignup} /> : <Navigate to="/home" />}
        />

        {/* Dashboard */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/bookings" element={isLoggedIn ? <Bookings /> : <Navigate to="/login" />} />
        <Route path="/bus" element={isLoggedIn ? <BusTicket /> : <Navigate to="/login" />} />
        <Route path="/schedule" element={isLoggedIn ? <Schedules /> : <Navigate to="/login" />} />
        <Route path="/route" element={isLoggedIn ? <BusRoutes /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default AppWrapper;
