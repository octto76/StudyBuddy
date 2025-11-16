import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { Match, Profile } from '../types';

interface MatchWithProfile {
  id: string;
  matchId: string;
  name: string;
  course: string;
  major: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  image: string;
  created_at: string;
}

// Demo matches that don't interact with database
const demoMatches: MatchWithProfile[] = [
  {
    id: 'demo-user-1',
    matchId: 'demo-match-1',
    name: 'Maxim Q.',
    course: 'COMP302',
    major: 'Computer Science',
    lastMessage: "Hey! Want to study for the midterm1 together?",
    time: '2h ago',
    unread: true,
    image: '/images/maxim.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-2',
    matchId: 'demo-match-2',
    name: 'Cheela Z.',
    course: 'COMP302',
    major: 'Computer Science',
    lastMessage: "Thanks for the help with lazy programming!",
    time: '5h ago',
    unread: false,
    image: '/images/monkey.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-3',
    matchId: 'demo-match-3',
    name: 'Jake Paul',
    course: 'MGCR222',
    major: 'Marketing',
    lastMessage: "Are you free to study tomorrow afternoon?",
    time: '1d ago',
    unread: true,
    image: 'https://ntvb.tmsimg.com/assets/assets/943387_v9_bb.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-4',
    matchId: 'demo-match-4',
    name: 'Wonyoung Jang',
    course: 'PSYC213',
    major: 'Psychology',
    lastMessage: "Great session today! Same time next week?",
    time: '2d ago',
    unread: false,
    image: 'https://tse4.mm.bing.net/th/id/OIP.nbziaMpyfb0DYAbLlq7FnAHaLI?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-5',
    matchId: 'demo-match-5',
    name: 'Jake Sim',
    course: 'COMP251',
    major: 'Computer Science',
    lastMessage: "I found a great resource for greedy algorithms!",
    time: '3d ago',
    unread: false,
    image: 'https://www.koreandrama.org/wp-content/uploads/EKbyp_5f.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-user-6',
    matchId: 'demo-match-6',
    name: 'Kujo Jotaro',
    course: 'ATOC568',
    major: 'Atmospheric and Oceanic Sciences',
    lastMessage: "Can you explain that concept again?",
    time: '4d ago',
    unread: false,
    image: 'https://i.pinimg.com/originals/bb/f8/4b/bbf84bb79038908db4bec25418d47ee1.jpg?nii=t',
    created_at: new Date().toISOString(),
  },
];

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Query matches where user is either user1 or user2
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (matchesError) throw matchesError;

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // 2. Extract other user IDs
      const otherUserIds = matchesData.map((match: Match) =>
        match.user1_id === user.id ? match.user2_id : match.user1_id
      );

      // 3. Fetch all profiles for matched users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherUserIds);

      if (profilesError) throw profilesError;

      // Create a map for quick lookup
      const profilesMap = new Map<string, Profile>();
      profilesData?.forEach((profile: Profile) => {
        profilesMap.set(profile.id, profile);
      });

      // 4. Fetch latest message for each match
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('match_id, content, created_at')
        .in('match_id', matchesData.map((m: Match) => m.id))
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Create a map of latest messages by match_id
      const latestMessagesMap = new Map<string, any>();
      messagesData?.forEach((msg: any) => {
        if (!latestMessagesMap.has(msg.match_id)) {
          latestMessagesMap.set(msg.match_id, msg);
        }
      });

      // 5. Combine data
      const transformed: MatchWithProfile[] = matchesData.map((match: Match) => {
        const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const profile = profilesMap.get(otherId);
        const latestMsg = latestMessagesMap.get(match.id);

        const courses = profile?.courses || [];
        const primaryCourse = courses.length > 0 ? courses[0] : profile?.current_subject || 'No course';

        return {
          id: otherId,
          matchId: match.id,
          name: profile?.username || 'Unknown User',
          course: primaryCourse,
          major: profile?.program || 'Unknown Program',
          lastMessage: latestMsg?.content || 'Start a conversation!',
          time: latestMsg ? getTimeAgo(latestMsg.created_at) : getTimeAgo(match.created_at),
          unread: false, // TODO: Implement unread logic if needed
          image: profile?.avatar_url || 'https://via.placeholder.com/100',
          created_at: match.created_at,
        };
      });

      // Add demo matches at the end for demo purposes
      setMatches([...transformed, ...demoMatches]);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    error,
    reload: loadMatches,
  };
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

