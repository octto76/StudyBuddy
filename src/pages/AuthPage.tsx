// src/pages/AuthPage.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
      // After this, AuthContext will update and App.tsx will switch away from AuthPage
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{
        backgroundImage: `url('/images/background.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="StudyBuddy logo"
            className="mx-auto mb-4 object-contain"
            style={{ width: "175px", height: "auto" }}
          />
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-[#757bc8] to-[#e0c3fc] bg-clip-text text-transparent mb-2"
            style={{
              fontSize: "60px",
              fontWeight: "bold",
            }}
          >
            StudyBuddy
          </h1>
          <p className="text-gray-600" style={{ fontSize: "30px" }}>
            Find your perfect study partner
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === "login"
                ? "Log in to continue your study journey"
                : "Join StudyBuddy to find your study partners"}
            </p>
          </div>

          {errorMsg && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff] focus:ring-2 focus:ring-[#9fa0ff]/20 transition-all"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Username only in register mode */}
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff] focus:ring-2 focus:ring-[#9fa0ff]/20 transition-all"
                placeholder="studykid123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={mode === "register"}
              />
              <p className="text-xs text-gray-500">
                This is the name other students will see.
              </p>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff] focus:ring-2 focus:ring-[#9fa0ff]/20 transition-all"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {mode === "register" && (
              <p className="text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-[#757bc8] transition-colors"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrorMsg(null);
              }}
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
