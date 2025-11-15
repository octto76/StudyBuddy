import { MessageCircle, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockMatches = [
  {
    id: '1',
    name: 'Maxim Q.',
    course: 'COMP302',
    major: 'Computer Science',
    lastMessage: "Hey! Want to study for the midterm1 together?",
    time: '2h ago',
    unread: true,
    image: '/images/maxim.jpg',
  },
  {
    id: '2',
    name: 'Cheela Z.',
    course: 'COMP302',
    major: 'Computer Science',
    lastMessage: "Thanks for the help with lazy programming!",
    time: '5h ago',
    unread: false,
    image: '/images/monkey.jpg',
  },
  {
    id: '3',
    name: 'Jake Paul',
    course: 'MGCR222',
    major: 'Marketing',
    lastMessage: "Are you free to study tomorrow afternoon?",
    time: '1d ago',
    unread: true,
    image: 'https://ntvb.tmsimg.com/assets/assets/943387_v9_bb.jpg',
  },
  {
    id: '4',
    name: 'Wonyound Jang',
    course: 'PSYC213',
    major: 'Psychology',
    lastMessage: "Great session today! Same time next week?",
    time: '2d ago',
    unread: false,
    image: 'https://tse4.mm.bing.net/th/id/OIP.nbziaMpyfb0DYAbLlq7FnAHaLI?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '5',
    name: 'Jake Sim',
    course: 'COMP251',
    major: 'Computer Science',
    lastMessage: "I found a great resource for greedy algorithms!",
    time: '3d ago',
    unread: false,
    image: 'https://www.koreandrama.org/wp-content/uploads/EKbyp_5f.jpg',
  },
  {
    id: '6',
    name: 'Jotaro Jostar',
    course: 'ATOC568',
    major: 'Atmospheric and Oceanic Sciences',
    lastMessage: "Can you explain that concept again?",
    time: '4d ago',
    unread: false,
    image: 'https://i.pinimg.com/originals/bb/f8/4b/bbf84bb79038908db4bec25418d47ee1.jpg?nii=t',
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
