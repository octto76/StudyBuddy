import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Send, Edit, UserPlus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";
import { useSessionDetail, joinSession, inviteToSession, getMatchedUsers } from "../hooks/useSessions";
import { useSessionChat } from "../hooks/useSessionChat";
import type { Profile } from "../types";

interface SessionDetailPageProps {
  onNavigate: (page: string, sessionId?: string) => void;
  sessionId: string;
}

export function SessionDetailPage({ onNavigate, sessionId }: SessionDetailPageProps) {
  const { user } = useAuth();
  const { session, loading, refetch } = useSessionDetail(sessionId, user?.id || null);
  const { messages, loading: chatLoading, sendMessage, sending } = useSessionChat(sessionId);
  const [message, setMessage] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState<Profile[]>([]);
  const [inviting, setInviting] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && session?.host_id === user.id) {
      loadMatchedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, session?.host_id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMatchedUsers = async () => {
    if (!user) return;
    try {
      const matches = await getMatchedUsers(user.id);
      setMatchedUsers(matches);
    } catch (err) {
      console.error('Error loading matched users:', err);
    }
  };

  const handleJoin = async () => {
    if (!user || !session) return;
    
    setJoining(true);
    setError(null);

    try {
      await joinSession(session.id, user.id);
      refetch();
    } catch (err: any) {
      console.error('Error joining session:', err);
      setError(err.message || 'Failed to join session');
    } finally {
      setJoining(false);
    }
  };

  const handleInvite = async (userId: string) => {
    if (!user || !session) return;

    setInviting(prev => new Set(prev).add(userId));

    try {
      await inviteToSession(session.id, user.id, userId);
      // Remove from list after successful invite
      setMatchedUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      console.error('Error inviting user:', err);
      alert(err.message || 'Failed to invite user');
    } finally {
      setInviting(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Session not found</div>
      </div>
    );
  }

  const isHost = user?.id === session.host_id;
  const isParticipant = session.participants?.some(p => p.user_id === user?.id && p.status === 'accepted');
  const isInvited = session.participants?.some(p => p.user_id === user?.id && p.status === 'invited');
  const isFull = (session.participant_count || 0) >= session.max_participants;
  const canChat = isHost || isParticipant;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return "TBD";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const { date, time } = formatDateTime(session.start_time);
  const duration = calculateDuration(session.start_time, session.end_time);

  // Filter participants to show only accepted ones (not pending invites)
  const acceptedParticipants = session.participants?.filter(p => p.status === 'accepted' && p.user_id !== session.host_id) || [];

  // Get uninvited matched users
  const invitedUserIds = new Set(session.participants?.map(p => p.user_id) || []);
  const uninvitedMatches = matchedUsers.filter(u => !invitedUserIds.has(u.id));

  return (
    <div className="flex h-screen">
      {/* Left Side - Session Info */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-8">
          <button
            onClick={() => onNavigate("sessions")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sessions
          </button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Session Card */}
          <div className="bg-gradient-to-br from-[#757bc8]/10 to-[#e0c3fc]/10 rounded-3xl p-6 mb-6 border border-[#9fa0ff]/20">
            <div className="flex items-start justify-between mb-3">
              <h2 className="flex-1">{session.title}</h2>
              {isHost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("edit-session", session.id);
                  }}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  title="Edit session"
                >
                  <Edit className="w-5 h-5 text-[#757bc8]" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm text-[#757bc8] rounded-lg text-sm">
                {session.course_code}
              </span>
              {!session.is_public && (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
                  Private
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-[#8e94f2]" />
                <span>
                  {date} at {time}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-[#bbadff]" />
                <span>{duration}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-[#dab6fc]" />
                <span>{session.location}</span>
              </div>
            </div>

            {session.description && (
              <p className="text-gray-700 mb-6">{session.description}</p>
            )}

            {!isHost && !isParticipant && (
              <button 
                onClick={handleJoin}
                disabled={joining || isFull}
                className="w-full py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? 'Joining...' : (isFull ? 'Session Full' : (isInvited ? 'Accept Invitation' : 'Join Session'))}
              </button>
            )}

            {isHost && (
              <button
                onClick={() => setShowInviteModal(!showInviteModal)}
                className="w-full py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Invite Matched Users
              </button>
            )}
          </div>

          {/* Host */}
          {session.host && (
            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="mb-4">Host</h3>
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={session.host.avatar_url || undefined}
                  alt={session.host.full_name || session.host.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p>{session.host.full_name || session.host.username}</p>
                  <p className="text-sm text-gray-600">
                    {session.host.program || 'Student'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3>Participants</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {session.participant_count || 0}/{session.max_participants}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {acceptedParticipants.length === 0 ? (
                <p className="text-sm text-gray-500">No other participants yet</p>
              ) : (
                acceptedParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <ImageWithFallback
                      src={participant.profile?.avatar_url || undefined}
                      alt={participant.profile?.full_name || participant.profile?.username || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm">{participant.profile?.full_name || participant.profile?.username}</p>
                      <p className="text-xs text-gray-500">{participant.profile?.program || 'Student'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Invite Modal */}
          {showInviteModal && isHost && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="mb-4">Invite Matched Users</h3>
              {uninvitedMatches.length === 0 ? (
                <p className="text-sm text-gray-500">No matched users available to invite</p>
              ) : (
                <div className="space-y-3">
                  {uninvitedMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={match.avatar_url || undefined}
                          alt={match.full_name || match.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm">{match.full_name || match.username}</p>
                          <p className="text-xs text-gray-500">{match.program || 'Student'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(match.id)}
                        disabled={inviting.has(match.id)}
                        className="px-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-lg hover:shadow-lg transition-shadow text-sm disabled:opacity-50"
                      >
                        {inviting.has(match.id) ? 'Inviting...' : 'Invite'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Group Chat */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h3>Group Chat</h3>
          <p className="text-sm text-gray-600">
            {canChat ? 'Chat with session participants' : 'Join the session to participate in chat'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {chatLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.sender_id === user?.id;
                const senderName = msg.sender_profile?.full_name || msg.sender_profile?.username || 'Unknown User';
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <ImageWithFallback
                        src={msg.sender_profile?.avatar_url || undefined}
                        alt={senderName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      
                      {/* Message Bubble */}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {isOwnMessage ? 'You' : senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white'
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          {!canChat ? (
            <div className="text-center text-sm text-gray-500 py-2">
              Join this session to participate in the chat
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
                disabled={sending}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim() || sending}
                className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-2xl hover:shadow-lg transition-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
