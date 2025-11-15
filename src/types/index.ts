// Type definitions for StudyBuddy

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
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  title: string;
  description: string | null;
  course: string | null;
  created_by: string;
  created_at: string;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  joined_at: string;
}

