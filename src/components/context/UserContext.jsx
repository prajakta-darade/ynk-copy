

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/Api"; // Use custom api instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    mobile: "",
    name: "",
    branch: "",
    isAuthenticated: false,
  }); // Initial state with defaults

  useEffect(() => {
    let intervalId;

    const checkSession = async () => {
      try {
        const response = await api.get("/api/auth/session", { withCredentials: true });
        console.log("Session check response:", response.data); // Debug log
        if (response.data.isAuthenticated && response.data.user) {
          setUser({
            id: response.data.user.id || response.data.user._id, // Handle both cases
            mobile: response.data.user.mobile,
            name: response.data.user.name,
            branch: response.data.user.branch,
            isAuthenticated: true,
          });
        } else {
          setUser({
            id: null,
            mobile: "",
            name: "",
            branch: "",
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Session check error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        setUser({
          id: null,
          mobile: "",
          name: "",
          branch: "",
          isAuthenticated: false,
        });
      }
    };

    checkSession(); // Initial check
    intervalId = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.post("/api/auth/login", userData, { withCredentials: true });
      console.log("Login response:", response.data); // Debug log
      if (response.data.user) {
        setUser({
          id: response.data.user.id || response.data.user._id,
          mobile: response.data.user.mobile,
          name: response.data.user.name,
          branch: response.data.user.branch,
          isAuthenticated: true,
        });
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post("/api/auth/logout", {}, { withCredentials: true });
      console.log("Logout response:", response.data); // Debug log
      if (response.data.message === "Logged out successfully") {
        setUser({
          id: null,
          mobile: "",
          name: "",
          branch: "",
          isAuthenticated: false,
        });
      } else {
        throw new Error(response.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};