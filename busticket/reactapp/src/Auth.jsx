import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

  
  const API_URL = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/users"; // backend base

const Auth = ({onLogin,onSignup}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        null,
        {
          params: {
            username: formData.username,
            password: formData.password,
          },
        }
      );
      alert(res.data);
      if (res.data.includes("successful")) {
        onLogin();
        navigate("/home"); // redirect to home page
      }
    } catch (err) {
      alert("Login failed ❌");
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }
    try {
      await axios.post(`${API_URL}/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      });
      alert("Signup successful ✅");
      onSignup();
      setIsSignup(false);
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  // Google Auth
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className={`form_container show ${isSignup ? "active" : ""}`}>
      <i
        className="uil uil-times form_close"
        onClick={() => navigate("/")}
      ></i>

      {/* Login Form */}
      {!isSignup && (
        <div className="form login_form">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>

            <div className="input_box">
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <i className="uil uil-user"></i>
            </div>

            <div className="input_box">
              <input
                type={showPassword.login ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="uil uil-lock password"></i>
              <i
                className={`uil ${
                  showPassword.login ? "uil-eye" : "uil-eye-slash"
                } pw_hide`}
                onClick={() => togglePassword("login")}
              ></i>
            </div>

            <button className="button" type="submit">
              Login Now
            </button>

            <button
              className="button google_btn"
              type="button"
              onClick={handleGoogleAuth}
            >
              Sign in with Google
            </button>

            <div className="login_signup">
              Don’t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(true);
                }}
              >
                Signup
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Signup Form */}
{isSignup && (
  <div className="form signup_form">
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>

      <div className="input_box">
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <i className="uil uil-user"></i>
      </div>

      <div className="input_box">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <i className="uil uil-envelope-alt email"></i>
      </div>

      <div className="input_box">
        <input
          type="text"
          name="mobile"
          placeholder="Enter your mobile number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <i className="uil uil-phone"></i>
      </div>

      {/* === Password + Confirm in Same Row === */}
      <div className="row_fields">
        <div className="input_box half_input">
          <input
            type={showPassword.signup ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <i className="uil uil-lock password"></i>
          <i
            className={`uil ${
              showPassword.signup ? "uil-eye" : "uil-eye-slash"
            } pw_hide`}
            onClick={() => togglePassword("signup")}
          ></i>
        </div>

        <div className="input_box half_input">
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <i className="uil uil-lock password"></i>
          <i
            className={`uil ${
              showPassword.confirm ? "uil-eye" : "uil-eye-slash"
            } pw_hide`}
            onClick={() => togglePassword("confirm")}
          ></i>
        </div>
      </div>

{/* === Buttons in Same Row === */}
<div className="button_row">
<button className="button" type="submit">
Signup Now
</button>

<button
className="button google_btn"
type="button"
onClick={handleGoogleAuth}
>
Sign up with Google
</button>
</div>

<div className="login_signup">
Already have an account?{" "}
<a
href="#"
onClick={(e) => {
e.preventDefault();
setIsSignup(false);
}}
>
Login
</a>
</div>
</form>
</div>
)}
    </div>
  );
};

export default Auth;
