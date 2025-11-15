import { Edit, MapPin, Calendar, Book, Target, LogOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { signOut } = useAuth();
  const userProfile = {
    name: 'Ali',
    major: 'Computer Science',
    year: 'Junior',
    location: 'Berkeley, CA',
    bio: 'CS junior passionate about algorithms and machine learning. Looking for study partners who enjoy collaborative problem-solving!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    courses: ['CS 170', 'CS 189', 'Math 110', 'EECS 126'],
    currentlyStudying: ['Algorithms', 'Machine Learning', 'Linear Algebra'],
    studyPreferences: {
      style: ['Group Study', 'Problem Sets', 'Teaching Others'],
      location: ['Main Library', 'Café', 'Study Rooms'],
      availability: ['Mon 2-5pm', 'Wed 3-6pm', 'Fri 1-4pm', 'Sat 10am-2pm'],
    },
    stats: {
      matches: 47,
      sessions: 23,
      hours: 156,
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>My Profile</h1>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button 
            onClick={signOut}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
        <div className="flex gap-6">
          <ImageWithFallback
            src={userProfile.image}
            alt={userProfile.name}
            className="w-32 h-32 rounded-3xl object-cover"
          />
          
          <div className="flex-1">
            <h2 className="mb-1">{userProfile.name}</h2>
            <p className="text-gray-600 mb-3">{userProfile.major} · {userProfile.year}</p>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {userProfile.location}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{userProfile.bio}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-[#757bc8]/10 to-[#9fa0ff]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] bg-clip-text text-transparent mb-1">
                  {userProfile.stats.matches}
                </div>
                <p className="text-sm text-gray-600">Matches</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#8e94f2]/10 to-[#bbadff]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#8e94f2] to-[#bbadff] bg-clip-text text-transparent mb-1">
                  {userProfile.stats.sessions}
                </div>
                <p className="text-sm text-gray-600">Sessions</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#dab6fc]/10 to-[#e0c3fc]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#dab6fc] to-[#e0c3fc] bg-clip-text text-transparent mb-1">
                  {userProfile.stats.hours}
                </div>
                <p className="text-sm text-gray-600">Study Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Card */}
      <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Book className="w-5 h-5 text-[#757bc8]" />
          <h3>Current Courses</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {userProfile.courses.map((course) => (
            <Badge
              key={course}
              className="px-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white border-0"
            >
              {course}
            </Badge>
          ))}
        </div>
      </div>

      {/* Currently Studying */}
      <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-[#8e94f2]" />
          <h3>Currently Studying</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {userProfile.currentlyStudying.map((topic) => (
            <Badge
              key={topic}
              className="px-4 py-2 bg-[#8e94f2]/10 text-[#757bc8] border border-[#8e94f2]/20"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Study Preferences */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#bbadff]" />
          <h3>Study Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-gray-600 mb-3">Study Style</h4>
            <div className="space-y-2">
              {userProfile.studyPreferences.style.map((style) => (
                <div key={style} className="text-sm px-3 py-2 bg-gray-50 rounded-lg">
                  {style}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-600 mb-3">Preferred Locations</h4>
            <div className="space-y-2">
              {userProfile.studyPreferences.location.map((loc) => (
                <div key={loc} className="text-sm px-3 py-2 bg-gray-50 rounded-lg">
                  {loc}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-600 mb-3">Availability</h4>
            <div className="space-y-2">
              {userProfile.studyPreferences.availability.map((time) => (
                <div key={time} className="text-sm px-3 py-2 bg-gray-50 rounded-lg">
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
