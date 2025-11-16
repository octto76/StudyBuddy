// Type definitions for StudyBuddy

export interface AvailabilitySlot {
  day: string; // e.g., "mon", "tue", "wed"
  start: string; // e.g., "13:00"
  end: string; // e.g., "18:00"
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  program: string | null;
  year: string | null;
  bio: string | null;
  avatar_url: string | null;
  current_subject: string | null;
  study_hours: number;
  has_onboarded: boolean;
  created_at: string;
  courses?: string[] | null; // Array of course codes
  availability?: AvailabilitySlot[] | null; // Array of time slots
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  course_code: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  is_public: boolean;
  max_participants: number;
  created_at: string;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  role: string; // 'host', 'participant', 'invited'
  status: string; // 'accepted', 'invited', 'declined'
  joined_at: string;
}

export interface SessionWithDetails extends StudySession {
  host?: Profile;
  participants?: (SessionParticipant & { profile?: Profile })[];
  participant_count?: number;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  target_id: string;
  direction: 'like' | 'pass';
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_profile?: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

