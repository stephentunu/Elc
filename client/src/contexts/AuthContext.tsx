import React, { createContext, useContext, useState, useEffect } from "react";

// Patch fetch to include admin auth headers on all tRPC requests
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
  const token = localStorage.getItem("elc_admin_token");
  const adminStr = localStorage.getItem("elc_admin");
  if (token && adminStr && typeof input === "string" && input.includes("/api/trpc")) {
    const admin = JSON.parse(adminStr);
    init = init || {};
    init.headers = {
      ...init.headers,
      "x-admin-token": token,
      "x-admin-email": admin.email,
    };
  }
  return originalFetch(input, init as RequestInit);
};

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("elc_admin_token");
    const savedAdmin = localStorage.getItem("elc_admin");
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/trpc/auth.adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email, password } }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Login failed");
      }

      const data = await response.json();
      const adminData = data?.result?.data?.json?.admin;

      if (!adminData || !adminData.email) {
        throw new Error("Invalid response format");
      }

      const newToken = `admin_${Date.now()}`;
      setToken(newToken);
      setAdmin(adminData);
      localStorage.setItem("elc_admin_token", newToken);
      localStorage.setItem("elc_admin", JSON.stringify(adminData));

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("elc_admin_token");
    localStorage.removeItem("elc_admin");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};