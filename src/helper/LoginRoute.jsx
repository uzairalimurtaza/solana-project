import { Navigate, Outlet } from "react-router-dom";
import React from "react";
const role = localStorage.getItem("role");
const token = localStorage.getItem("uToken");
const useAuth = () => {
  if (token) {
    return true;
  } else {
    return false;
  }

  // const user = { loggedIn: false };
  // return false;
};

const LoginRoutes = () => {
  const isAuth = useAuth();

  if (isAuth) {
    if (role === "admin") {
      return <Navigate to="/admin/categories" />;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Outlet />;
  }
};

export default LoginRoutes;
