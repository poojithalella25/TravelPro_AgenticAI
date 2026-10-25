import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error: any) {
          console.error('Failed to fetch user context:', error);
          // Only clear token if unauthorized 401
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      setToken(data.access_token);
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      setToken(data.access_token);
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updatePreferences = async (prefs: any) => {
    try {
      const res = await authService.updatePreferences(prefs);
      if (user) {
        setUser({ ...user, preferences: res.preferences });
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
