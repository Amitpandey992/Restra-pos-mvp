import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authApi.getUserProfile();
          if (response && response.data) {
            setUser(response.data);
          } else {
            throw new Error("Failed to fetch user");
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response && response.data && response.data.tokens) {
        localStorage.setItem("token", response.data.tokens.accessToken);
        localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error("Invalid response form server");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  const register = async (userData) => {
    return await authApi.register(userData);
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
