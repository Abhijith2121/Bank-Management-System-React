import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const accessToken=authTokens?.access_token
  if (!accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const authTokens = JSON.parse(localStorage.getItem('adminAuthTokens'));
  const accessToken=authTokens?.access_token
  if (!accessToken) {
    return <Navigate to='/admin' state={{ from: location }} replace />;
  }

  return children;
}
function StaffProtectedRoute({ children }) {
  const location = useLocation();
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const accessToken=authTokens?.access_token
  const decodedToken = jwtDecode(authTokens.access_token);
  const userType = decodedToken.user_type;
  console.log("From staff protection"+userType)

  if (!accessToken || !userType || userType !== "2") {
    return <Navigate to='/login' state={{ from: location }} replace />;
}

  return children;
}
function ManagerProtectedRoute({ children }) {
  const location = useLocation();
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const accessToken=authTokens?.access_token
  const decodedToken = jwtDecode(authTokens.access_token);
  const userType = decodedToken.user_type;
  console.log("From staff protection"+userType)

  if (!accessToken || !userType || userType !== "1") {
    return <Navigate to='/login' state={{ from: location }} replace />;
}

  return children;
}



export { ProtectedRoute, AdminProtectedRoute,StaffProtectedRoute,ManagerProtectedRoute };