import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.get("/user/profile/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => logout());
    } else {
      setUser(null);
      navigate("/login"); // Redirect if no token
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post("/login/", credentials);
      console.log("Login Response:", response.data); // Debugging login
      if (response.data.access) {  
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
  
        // Fetch user profile after login
        const profileResponse = await api.get("/user/profile/", {
          headers: { Authorization: `Bearer ${response.data.access}` }
        });
  
        setUser(profileResponse.data);
  
        // Move navigation to useEffect
      } else {
        throw new Error("Login failed, no access token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid username or password");
    }
  };
  
  //  Handle navigation after user is set
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [user, navigate]);
  

  
  const logout = () => {
    //  Remove tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  
    //  Completely remove token from axios headers
    delete api.defaults.headers.common["Authorization"];
  
    //  Clear the user and token state
    setUser(null);
    setToken(null);
  
    //  Force navigation after state update
    setTimeout(() => {
      navigate("/login");
      window.location.reload(); // Force UI refresh to clear cached state
    }, 100);
  };
  
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
