import { useState } from 'react';
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import { Navigation } from './components/Navigation';
import { DiscoverPage } from './components/DiscoverPage';
import { ProfilePage } from './components/ProfilePage';
import { MatchesPage } from './components/MatchesPage';
import { ChatPage } from './components/ChatPage';
import { CreateSessionPage } from './components/CreateSessionPage';
import { SessionsPage } from './components/SessionsPage';
import { SessionDetailPage } from './components/SessionDetailPage';

export default function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('discover');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // While checking token/session
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#757bc8] to-[#e0c3fc] bg-clip-text text-transparent mb-4">
          StudyBuddy
        </h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no user → show Login/Register
  if (!user) {
    return <AuthPage />;
  }

  // If logged in → show real app with navigation
  const handleNavigate = (page: string, sessionId?: string) => {
    setCurrentPage(page);
    if (sessionId) {
      setSelectedSessionId(sessionId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'discover':
        return <DiscoverPage />;
      case 'sessions':
        return <SessionsPage onNavigate={handleNavigate} />;
      case 'matches':
        return <MatchesPage onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatPage />;
      case 'profile':
        return <ProfilePage />;
      case 'create-session':
        return <CreateSessionPage />;
      case 'session-detail':
        return <SessionDetailPage onNavigate={handleNavigate} />;
      default:
        return <DiscoverPage />;
    }
  };

  // Special layout for chat and session detail (no left padding)
  const isFullWidth = currentPage === 'chat' || currentPage === 'session-detail';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className={isFullWidth ? 'ml-64' : 'ml-64'}>
        {renderPage()}
      </main>
    </div>
  );
}
