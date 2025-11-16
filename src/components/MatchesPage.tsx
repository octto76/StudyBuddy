import { MessageCircle, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMatches } from '../hooks/useMatches';

interface MatchesPageProps {
  onNavigate: (page: string) => void;
}

export function MatchesPage({ onNavigate }: MatchesPageProps) {
  const { matches, loading, error } = useMatches();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="mb-8">Your Matches</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#757bc8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="mb-8">Your Matches</h1>
        <div className="text-center text-red-600 py-20">
          <p>Error loading matches: {error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Your Matches</h1>
          <p className="text-gray-600">Connect with your study buddies</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => onNavigate('chat')}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#9fa0ff] hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <ImageWithFallback
                  src={match.image}
                  alt={match.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                {match.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 truncate">{match.name}</h3>
                <p className="text-sm text-gray-600 truncate">{match.major}</p>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#757bc8]/10 to-[#9fa0ff]/10 text-[#757bc8] rounded-lg text-sm">
                {match.course}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">{match.lastMessage}</p>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {match.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
