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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-white text-center">
          {mode === "login" ? "Log In" : "Create your StudyBuddy account"}
        </h1>

        {errorMsg && (
          <div className="text-sm text-red-300 bg-red-900/40 border border-red-500/40 rounded px-3 py-2">
            {errorMsg}
          </div>
        )}

        {/* Email always shown */}
        <div className="space-y-1">
          <label className="text-sm text-slate-200">Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Username only in register mode */}
        {mode === "register" && (
          <div className="space-y-1">
            <label className="text-sm text-slate-200">Username</label>
            <input
              className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="studykid123"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required={mode === "register"}
            />
            <p className="text-xs text-slate-400">
              This is the name other students will see.
            </p>
          </div>
        )}

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm text-slate-200">Password</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Log In"
            : "Create Account"}
        </button>

        <button
          type="button"
          className="w-full text-xs text-slate-300 underline mt-1"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
