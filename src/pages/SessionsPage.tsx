import { useAuth } from "../context/AuthContext";

export default function SessionsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email}</h1>
      <p>This is the Sessions Page. You are logged in!</p>
      <button
        onClick={signOut}
        className="mt-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}