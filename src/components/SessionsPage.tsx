import { Plus, Search, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { SessionWithDetails } from "../types";

interface SessionsPageProps {
  onNavigate: (page: string, sessionId?: string) => void;
}

export function SessionsPage({ onNavigate }: SessionsPageProps) {
  const { user } = useAuth();
  const { mySessions, invitedSessions, publicSessions, loading } = useSessions(user?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [dateFilter, setDateFilter] = useState("All Dates");

  // Filter sessions
  const filterSessions = (sessions: SessionWithDetails[]) => {
    return sessions.filter(session => {
      const matchesSearch = searchQuery === "" || 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.course_code?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourse = courseFilter === "All Courses" || 
        session.course_code === courseFilter;
      
      // Date filtering logic
      let matchesDate = true;
      if (dateFilter !== "All Dates") {
        const now = new Date();
        const sessionDate = new Date(session.start_time);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);

        switch (dateFilter) {
          case "Today":
            matchesDate = sessionDate >= today && sessionDate < tomorrow;
            break;
          case "Tomorrow":
            matchesDate = sessionDate >= tomorrow && sessionDate < weekEnd;
            break;
          case "This Week":
            matchesDate = sessionDate >= today && sessionDate < weekEnd;
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesCourse && matchesDate;
    });
  };

  // Format date and time
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  // Calculate duration
  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return "TBD";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  // Get all unique courses for filter
  const allCourses = Array.from(new Set([...mySessions, ...publicSessions, ...invitedSessions]
    .map(s => s.course_code)
    .filter(Boolean)));

  // Separate my sessions into public and private
  const myPublicSessions = mySessions.filter(s => s.is_public);
  const myPrivateSessions = mySessions.filter(s => !s.is_public);

  const renderSessionCard = (session: SessionWithDetails, showEditButton = false) => {
    const { date, time } = formatDateTime(session.start_time);
    const duration = calculateDuration(session.start_time, session.end_time);
    const isFull = (session.participant_count || 0) >= session.max_participants;
    const isMySession = session.host_id === user?.id;
    const hostName = isMySession ? "You" : (session.host?.full_name || session.host?.username || "Unknown Host");

    return (
      <div
        key={session.id}
        onClick={() => onNavigate("session-detail", session.id)}
        className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#9fa0ff] hover:shadow-lg transition-all cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="mb-2">{session.title}</h3>
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#757bc8]/10 to-[#9fa0ff]/10 text-[#757bc8] rounded-lg text-sm">
              {session.course_code}
            </span>
          </div>
          {!session.is_public && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
              Private
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#8e94f2]" />
            <span>
              {date} at {time}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-[#bbadff]" />
            <span>{duration}</span>
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
              src={session.host?.avatar_url || undefined}
              alt={hostName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">
              Hosted by {hostName}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              {session.participant_count || 0}/{session.max_participants}
            </span>
          </div>
        </div>

        {/* Join Button */}
        <button 
          className="w-full mt-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("session-detail", session.id);
          }}
        >
          {isFull ? "Session Full" : (showEditButton ? "Manage Session" : "View Session")}
        </button>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Study Sessions</h1>
          <p className="text-gray-600">Discover and join study sessions</p>
        </div>
        <button
          onClick={() => onNavigate("create-session")}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option>All Courses</option>
            {allCourses.map(course => (
              <option key={course || 'unknown'} value={course || ''}>{course}</option>
            ))}
          </select>

          <select 
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option>All Dates</option>
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* My Private Sessions */}
      {myPrivateSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4">My Private Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterSessions(myPrivateSessions).map((session) => renderSessionCard(session, true))}
          </div>
        </div>
      )}

      {/* My Public Sessions */}
      {myPublicSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4">My Public Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterSessions(myPublicSessions).map((session) => renderSessionCard(session, true))}
          </div>
        </div>
      )}

      {/* Invited Sessions */}
      {invitedSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4">Invited Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterSessions(invitedSessions).map((session) => renderSessionCard(session, false))}
          </div>
        </div>
      )}

      {/* Public Sessions */}
      <div className="mb-8">
        <h2 className="mb-4">Public Sessions</h2>
        {filterSessions(publicSessions).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-600">No public sessions available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterSessions(publicSessions).map((session) => renderSessionCard(session, false))}
          </div>
        )}
      </div>
    </div>
  );
}
