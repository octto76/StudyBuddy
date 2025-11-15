import { MessageCircle, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockMatches = [
  {
    id: '1',
    name: 'Sarah Chen',
    course: 'CS 170',
    major: 'Computer Science',
    lastMessage: "Hey! Want to study for the midterm together?",
    time: '2h ago',
    unread: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    course: 'Math 110',
    major: 'Mathematics',
    lastMessage: "Thanks for the help with linear algebra!",
    time: '5h ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    course: 'Bio 1A',
    major: 'Biology',
    lastMessage: "Are you free to study tomorrow afternoon?",
    time: '1d ago',
    unread: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Alex Kim',
    course: 'Econ 101',
    major: 'Economics',
    lastMessage: "Great session today! Same time next week?",
    time: '2d ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Jessica Park',
    course: 'CS 189',
    major: 'Computer Science',
    lastMessage: "I found a great resource for ML algorithms",
    time: '3d ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Ryan Lee',
    course: 'Physics 7A',
    major: 'Physics',
    lastMessage: "Can you explain that concept again?",
    time: '4d ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  },
];

interface MatchesPageProps {
  onNavigate: (page: string) => void;
}

export function MatchesPage({ onNavigate }: MatchesPageProps) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Your Matches</h1>
          <p className="text-gray-600">Connect with your study buddies</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl">
          {mockMatches.filter(m => m.unread).length} new messages
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMatches.map((match) => (
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
