import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({ children, isLoginPage }) => {
  const token = Cookie.get('auth_token'); 
  console.log(token, 'token');

  if (isLoginPage) {
    if (token) {
     
      return <Navigate to="/" />;
    }
  
    return children;
  }

 
  if (!token) {
    return <Navigate to="/login" />;
  }

  
  return children;
};

export default ProtectedRoute;
