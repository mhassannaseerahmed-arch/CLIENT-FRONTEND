import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User, UserRole } from "../services/storage";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 🔥 On app start → just ask backend "who am I?"
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const res = await axiosInstance.get<User>("/auth/me");
        if (cancelled) return;
        setUser(res.data);
      } catch {
        if (cancelled) return;
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login: AuthContextType["login"] = async ({ email, password }) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/login", { email, password });

      const res = await axiosInstance.get<User>("/auth/me");
      setUser(res.data);

      navigate("/");
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextType["register"] = async ({ email, username, password, role }) => {
    setLoading(true);
    try {
      const safeRole: UserRole = "employee";

      await axiosInstance.post("/auth/register", {
        email,
        username,
        password,
        role: safeRole,
      });

      const res = await axiosInstance.get<User>("/auth/me");
      setUser(res.data);

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};