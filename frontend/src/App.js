import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UserDashboard from "./components/Dashboard/UserDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/user"
        element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>}
      />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />  {/* Default route */}
    </Routes>
  );
}

export default App;
