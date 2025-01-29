import React, { useEffect, useState } from "react";
import { supabase } from "../../Utils/SupabaseClient";
import Dashboard from "./Dashboard";
import "./Login.css";
import { FiLogIn, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState([false, false]);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const togglePasswordVisibility = () => {
    if (!showPassword) {
      setIsRevealing(true);
      setTimeout(() => setIsRevealing(false), 600);
    }
    setShowPassword(!showPassword);
  };

  // Handle user inactivity
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    const logout = async () => {
      await supabase.auth.signOut();
      setLoggedIn(false);
      setUser(null);
      setSession(null);
    };

    const activityListeners = () => {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
    };

    const cleanupListeners = () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };

    if (loggedIn) {
      resetTimer();
      activityListeners();

      return () => {
        cleanupListeners();
        clearTimeout(timeoutId);
      };
    }
  }, [loggedIn]);

  const validateForm = () => {
    const errors = [false, false];
    if (!/\S+@\S+\.\S+/.test(email)) errors[0] = true;
    if (password.length < 8) errors[1] = true;
    setFormError(errors);
    return !errors.includes(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fix the form errors");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      setLoggedIn(true);
      setUser(data.user);
      setSession(data.session);
      setError("");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <>
      {!loggedIn ? (
        <div className="login-container">
          <div className="login-card">
            <h1>Artist Login</h1>
            <form onSubmit={handleLogin} noValidate>
              <div className="login-input-group">
                <div className="input-wrapper">
                  <input
                    className="login-input"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  {formError[0] && (
                    <div className="error-message">
                      <FiAlertCircle style={{ marginRight: "8px" }} />
                      Please enter a valid email address
                    </div>
                  )}
                </div>
              </div>

              <div className="login-input-group">
                <div className="input-wrapper">
                  <input
                    className={`login-input ${
                      isRevealing ? "is-revealing" : ""
                    }`}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formError[1] && (
                  <div className="error-message">
                    <FiAlertCircle />
                    Password must be at least 8 characters
                  </div>
                )}
              </div>

              {error && (
                <div className="error-message">
                  <FiAlertCircle style={{ marginRight: "8px" }} />
                  {error}
                </div>
              )}

              <div className="button-group">
                <button type="submit" className="login-button">
                  <FiLogIn style={{ marginRight: "8px" }} />
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Dashboard user={user} session={session} />
      )}
    </>
  );
};

export default Login;
