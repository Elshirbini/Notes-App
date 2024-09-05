/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export default function ProtectedRoutes({ children }) {
  let token = localStorage.getItem("token");
  try {
    const decoded = jwtDecode(token);
    console.log(decoded);
  } catch (err) {
    localStorage.clear();

    return <Navigate to="/login" />;
  }

  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
