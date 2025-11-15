import { useState } from 'react';
import { useAuth } from "./context/AuthContext";
import { useProfile } from "./hooks/useProfile";
import AuthPage from "./pages/AuthPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import { Navigation } from './components/Navigation';
import { DiscoverPage } from './components/DiscoverPage';
import { ProfilePage } from './components/ProfilePage';
import { MatchesPage } from './components/MatchesPage';
import { ChatPage } from './components/ChatPage';
import { CreateSessionPage } from './components/CreateSessionPage';
import { SessionsPage } from './components/SessionsPage';
import { SessionDetailPage } from './components/SessionDetailPage';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, setProfile } = useProfile();
  const [currentPage, setCurrentPage] = useState('discover');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // While checking auth or profile
  if (authLoading || profileLoading) {
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

  // If user hasn't completed onboarding → show ProfileSetupPage
  // Show onboarding if: profile is null (new user) OR profile exists but not onboarded
  const needsOnboarding = !profile || !profile.has_onboarded;
  
  if (needsOnboarding) {
    return (
      <ProfileSetupPage
        onDone={() => {
          // Update local profile state to reflect onboarding completion
          if (profile) {
            setProfile({ ...profile, has_onboarded: true });
          } else {
            // For new users, reload to fetch the updated profile
            window.location.reload();
          }
        }}
      />
    );
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
    <div className="flex">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="ml-64 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {currentPage === 'discover' && <DiscoverPage />}
            {currentPage === 'sessions' && <SessionsPage />}
            {currentPage === 'matches' && <MatchesPage />}
            {currentPage === 'chat' && <ChatPage />}
            {currentPage === 'profile' && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
