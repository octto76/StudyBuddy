import { Home, Calendar, Users, MessageSquare, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'discover', label: 'Discover', icon: Home },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'matches', label: 'Matches', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col p-6">
      <div className="mb-12 flex items-center gap-3">
        <img 
          src="/images/logo.png" 
          alt="StudyBuddy logo" 
          className="h-16 w-16"
        />
        <h1 className="bg-gradient-to-r from-[#757bc8] to-[#e0c3fc] bg-clip-text text-transparent text-lg font-bold">
          StudyBuddy
        </h1>
      </div>
      
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
