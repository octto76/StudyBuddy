import { Plus, Search, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockSessions = [
  {
    id: '1',
    title: 'CS 170 Midterm Prep',
    course: 'CS 170',
    date: 'Nov 16, 2025',
    time: '3:00 PM',
    duration: '2 hours',
    location: 'Main Library, 3rd Floor',
    host: 'Sarah Chen',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    participants: 4,
    maxParticipants: 6,
    isPublic: true,
  },
  {
    id: '2',
    title: 'Linear Algebra Problem Set',
    course: 'Math 110',
    date: 'Nov 17, 2025',
    time: '2:00 PM',
    duration: '3 hours',
    location: 'Café Strada',
    host: 'Marcus Johnson',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    participants: 2,
    maxParticipants: 4,
    isPublic: true,
  },
  {
    id: '3',
    title: 'Biology Lab Report Writing',
    course: 'Bio 1A',
    date: 'Nov 18, 2025',
    time: '10:00 AM',
    duration: '4 hours',
    location: 'Life Sciences Building',
    host: 'Emily Rodriguez',
    hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    participants: 3,
    maxParticipants: 5,
    isPublic: true,
  },
  {
    id: '4',
    title: 'Machine Learning Study Group',
    course: 'CS 189',
    date: 'Nov 19, 2025',
    time: '4:00 PM',
    duration: '2 hours',
    location: 'Soda Hall',
    host: 'Jessica Park',
    hostImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    participants: 5,
    maxParticipants: 8,
    isPublic: true,
  },
  {
    id: '5',
    title: 'Economics Problem Discussion',
    course: 'Econ 101',
    date: 'Nov 20, 2025',
    time: '1:00 PM',
    duration: '2 hours',
    location: 'Student Union',
    host: 'Alex Kim',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    participants: 1,
    maxParticipants: 2,
    isPublic: false,
  },
  {
    id: '6',
    title: 'Physics Problem Sets',
    course: 'Physics 7A',
    date: 'Nov 21, 2025',
    time: '5:00 PM',
    duration: '3 hours',
    location: 'Physics Library',
    host: 'Ryan Lee',
    hostImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    participants: 4,
    maxParticipants: 6,
    isPublic: true,
  },
];

interface SessionsPageProps {
  onNavigate: (page: string, sessionId?: string) => void;
}

export function SessionsPage({ onNavigate }: SessionsPageProps) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Study Sessions</h1>
          <p className="text-gray-600">Discover and join study sessions</p>
        </div>
        <button
          onClick={() => onNavigate('create-session')}
          className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
            />
          </div>
          
          <select className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]">
            <option>All Courses</option>
            <option>CS 170</option>
            <option>Math 110</option>
            <option>Bio 1A</option>
          </select>
          
          <select className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]">
            <option>All Dates</option>
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onNavigate('session-detail', session.id)}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#9fa0ff] hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-2">{session.title}</h3>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#757bc8]/10 to-[#9fa0ff]/10 text-[#757bc8] rounded-lg text-sm">
                  {session.course}
                </span>
              </div>
              {!session.isPublic && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
                  Private
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#8e94f2]" />
                <span>{session.date} at {session.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#bbadff]" />
                <span>{session.duration}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#dab6fc]" />
                <span>{session.location}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={session.hostImage}
                  alt={session.host}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600">Hosted by {session.host}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{session.participants}/{session.maxParticipants}</span>
              </div>
            </div>

            {/* Join Button */}
            <button className="w-full mt-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow">
              {session.participants >= session.maxParticipants ? 'Session Full' : 'Join Session'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
