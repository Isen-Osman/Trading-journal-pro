"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/src/lib/api";
import { setToken as saveToken, logout as clearToken } from "@/src/lib/auth";

interface User {
  username?: string;
  email?: string;
  loggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const res = await api.get("/auth/me");
        setUser({ loggedIn: true, ...res.data }); 
      } catch (error) {
        clearToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await api.post("/auth/login", formData);
    const token = res.data.access_token;
    saveToken(token);
    
    // Fetch user details after login to get full user object
    const userRes = await api.get("/auth/me");
    setUser({ loggedIn: true, ...userRes.data });
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return res.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
