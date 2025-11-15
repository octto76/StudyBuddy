import './App.css'
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import SessionsPage from "./pages/SessionsPage"; 

export default function App() {
  const { user, loading } = useAuth();

  // While checking token/session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // If no user → show Login/Register
  if (!user) {
    return <AuthPage />;
  }

  // If logged in → show real app
  return <SessionsPage />;
}