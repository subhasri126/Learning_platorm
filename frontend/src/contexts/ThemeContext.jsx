import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { token } = useAuth();
  const [theme, setTheme] = useState('dark');
  const debounceRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }
  }, [theme]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    const fetchTheme = async () => {
      try {
        const response = await axios.get('/theme');
        const serverTheme = response.data?.data?.theme;
        if (isMounted && (serverTheme === 'dark' || serverTheme === 'light')) {
          setTheme(serverTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    fetchTheme();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const apiBase = axios.defaults.baseURL || 'http://localhost:5000/api';
    const streamUrl = `${apiBase}/theme/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(streamUrl);

    const handleThemeChanged = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.theme === 'dark' || data?.theme === 'light') {
          setTheme(data.theme);
        }
      } catch (error) {
        console.error('Failed to parse theme update:', error);
      }
    };

    eventSource.addEventListener('themeChanged', handleThemeChanged);

    return () => {
      eventSource.removeEventListener('themeChanged', handleThemeChanged);
      eventSource.close();
    };
  }, [token]);

  useEffect(() => () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  const pushThemeUpdate = (nextTheme) => {
    if (!token) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        await axios.post('/theme', { theme: nextTheme });
      } catch (error) {
        console.error('Failed to update theme:', error);
      }
    }, 150);
  };

  const toggleTheme = () =>
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      pushThemeUpdate(nextTheme);
      return nextTheme;
    });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
