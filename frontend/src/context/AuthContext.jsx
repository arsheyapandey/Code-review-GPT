import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a new context so components can access it
export const AuthContext = createContext(null);

// Create a provider component that will wrap our application
export const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // State to easily check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // This effect runs whenever the token changes
  useEffect(() => {
    if (token) {
      // If a token exists, set it as a default header for all future axios requests
      axios.defaults.headers.common['x-auth-token'] = token;
      // Save the token to the browser's local storage for persistence
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      // If there's no token, remove the header and clear local storage
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [token]);

  // Function to log in a user by fetching a token from the backend
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
    setToken(res.data.token); // This triggers the useEffect hook
  };

  // Function to log out a user by clearing the token
  const logout = () => {
    setToken(null); // This also triggers the useEffect hook
  };

  // Provide the authentication state and functions to the rest of the app
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
