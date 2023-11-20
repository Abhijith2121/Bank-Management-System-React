
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({
    username: '',
    accountName: '',
    isAuthenticated: false,
  });

  const setAccountName = (accountName) => {
    setAuthData({ ...authData, accountName });
  };

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    if (authTokens && authTokens.access_token) {
      const decodedToken = jwtDecode(authTokens.access_token);
      const username = decodedToken.username;
      const accountName = decodedToken.account_name;
      setAuthData({
        username,
        accountName,
        isAuthenticated: true,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authData, setAccountName }}>
      {children}
    </AuthContext.Provider>
  );
}
