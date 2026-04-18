import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
    } catch {
      setError("Login failed. Please check your credentials and ensure your MongoDB connection is configured on Vercel.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-96 border border-gray-100"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          Demo users: <span className="font-mono">admin@demo.com</span>, <span className="font-mono">manager@demo.com</span>,{" "}
          <span className="font-mono">employee@demo.com</span>, <span className="font-mono">client@demo.com</span>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] transition-all"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
          Client Management System
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          New here?{" "}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
