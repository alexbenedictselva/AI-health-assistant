import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  getUserId: () => number;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* =========================
     Restore session on refresh
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* =========================
     Login
     ========================= */
  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  /* =========================
     Logout (manual or forced)
     ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /* =========================================
     🚨 Auto logout when token expires (401)
     Triggered by Axios interceptor
     ========================================= */
  // Note: navigation is handled by App/AuthListener. AuthProvider only manages auth state.
  useEffect(() => {
    const handleAuthInvalid = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setIsAuthenticated(false);
      // Do not call navigate here; AuthListener in App will perform navigation.
    };

    window.addEventListener("auth:invalid", handleAuthInvalid);

    return () => {
      window.removeEventListener("auth:invalid", handleAuthInvalid);
    };
  }, []);

  /* =========================
     Safe User ID for APIs
     ========================= */
  const getUserId = () => {
    const uid = user?.id;
    if (
      typeof uid === "number" &&
      Number.isFinite(uid) &&
      Math.abs(uid) < 2147483647
    ) {
      return uid;
    }
    return 1; // fallback (dev-safe)
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        getUserId,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   Hook
   ========================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
