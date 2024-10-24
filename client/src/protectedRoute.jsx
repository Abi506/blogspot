import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({ children, isLoginPage }) => {
  const token = Cookie.get('auth_token'); // Correct way to get token using js-cookie
  console.log(token, 'token');

  if (isLoginPage) {
    if (token) {
      // If token exists and trying to access login or register page, redirect to home
      return <Navigate to="/" />;
    }
    // If no token, allow access to login or register
    return children;
  }

  // If no token is found for other routes, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, allow access to the children component
  return children;
};

export default ProtectedRoute;
