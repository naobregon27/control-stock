import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, userRole, allowedRoles, checkPermissions }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  if (checkPermissions && !checkPermissions()) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;