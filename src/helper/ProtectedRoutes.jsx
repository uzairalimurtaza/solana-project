import { Navigate, Outlet } from "react-router-dom";
import React from "react";
const useAuth = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("uToken");
  if (token) {
    if (role && (role === "user" || role === "content creator")) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
