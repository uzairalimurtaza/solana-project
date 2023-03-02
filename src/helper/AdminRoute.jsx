import { Navigate, Outlet } from "react-router-dom";
import React from "react";
const useAuth = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("uToken");

  if (token) {
    if (role && role === "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }

  // const user = { loggedIn: false };
  // return false;
};

const AdminRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
