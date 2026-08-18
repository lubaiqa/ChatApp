import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const verifyUser = () => {
  const { authUser } = useAuth();
  return authUser ? <Outlet /> : <Navigate to={"/login"} />;
};
