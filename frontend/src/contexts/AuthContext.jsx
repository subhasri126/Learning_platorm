import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    const response = await axios.post('/auth/login', { email, password, role });

    // Check if response has flat structure or old nested structure (robustness)
    const data = response.data.data || response.data;
    const { token: newToken, user: userData } = data;

    // Validate token exists
    if (!newToken) throw new Error('No token received from server');

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    return response.data;
  };

  const register = async (email, password, name, role) => {
    const response = await axios.post('/auth/register', { email, password, name, role });

    // Check if response has flat structure or old nested structure (robustness)
    const data = response.data.data || response.data;
    const { token: newToken, user: userData } = data;

    // Validate token exists
    if (!newToken) throw new Error('No token received from server');

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'instructor',
    isLearner: user?.role === 'user'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
