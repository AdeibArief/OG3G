import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null);
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data);
      return res.data; // 👈 return it
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const register = async (userName, email, password) => {
    try {
      setError(null);
      const res = await api.post("/api/auth/register", {
        userName,
        email,
        password,
      });
      setUser(res.data);
      return res.data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.post("/api/auth/logout");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
