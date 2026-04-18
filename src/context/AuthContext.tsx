import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User, UserRole } from "../services/storage";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? (JSON.parse(savedUser) as User) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();



  // On app start, try to restore a session (accessToken → /me, otherwise refresh cookie → /me)
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (localStorage.getItem("accessToken")) {
          const me = await axiosInstance.get<User>("/auth/me");
          if (cancelled) return;
          setUser(me.data);
          localStorage.setItem("user", JSON.stringify(me.data));
          return;
        }

        const refresh = await axiosInstance.post<{ accessToken: string }>("/auth/refresh");
        if (cancelled) return;
        setAccessToken(refresh.data.accessToken);
        localStorage.setItem("accessToken", refresh.data.accessToken);

        const me = await axiosInstance.get<User>("/auth/me");
        if (cancelled) return;
        setUser(me.data);
        localStorage.setItem("user", JSON.stringify(me.data));
      } catch {
        if (cancelled) return;
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login: AuthContextType["login"] = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post<{ accessToken: string }>("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      localStorage.setItem("accessToken", res.data.accessToken);

      const me = await axiosInstance.get<User>("/auth/me");
      setUser(me.data);
      localStorage.setItem("user", JSON.stringify(me.data));
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextType["register"] = async ({ email, username, password, role }) => {
    setLoading(true);
    try {
      const safeRole: UserRole = role ?? "employee";
      const res = await axiosInstance.post<{ accessToken: string }>("/auth/register", {
        email,
        username,
        password,
        role: safeRole,
      });
      setAccessToken(res.data.accessToken);
      localStorage.setItem("accessToken", res.data.accessToken);

      const me = await axiosInstance.get<User>("/auth/me");
      setUser(me.data);
      localStorage.setItem("user", JSON.stringify(me.data));
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
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
