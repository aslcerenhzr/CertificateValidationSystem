// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: string[]; // Optional array of roles allowed to access the route
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { token, user } = useAuth();

  if (!token) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // User does not have the required role
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required role (if specified)
  return children;
};
