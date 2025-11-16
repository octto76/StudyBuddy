import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { StudySession, SessionWithDetails, Profile } from '../types';

export function useSessions(userId: string | null) {
  const [mySessions, setMySessions] = useState<SessionWithDetails[]>([]);
  const [invitedSessions, setInvitedSessions] = useState<SessionWithDetails[]>([]);
  const [publicSessions, setPublicSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load my sessions (where I'm the host)
      const { data: mySessionsData, error: myError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('host_id', userId)
        .order('start_time', { ascending: true });

      if (myError) throw myError;

      // Load invited sessions
      // First get session IDs where user is invited
      const { data: invitedParticipants, error: invitedError } = await supabase
        .from('session_participants')
        .select('session_id')
        .eq('user_id', userId)
        .neq('role', 'host');

      if (invitedError) throw invitedError;

      const invitedSessionIds = invitedParticipants?.map(p => p.session_id) || [];

      let invitedSessionsData: StudySession[] = [];
      if (invitedSessionIds.length > 0) {
        const { data, error: invitedSessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .in('id', invitedSessionIds)
          .eq('is_public', false)
          .order('start_time', { ascending: true });

        if (invitedSessionsError) throw invitedSessionsError;
        invitedSessionsData = data || [];
      }

      // Load public sessions
      const { data: publicSessionsData, error: publicError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('is_public', true)
        .order('start_time', { ascending: true });

      if (publicError) throw publicError;

      // Collect all unique host IDs
      const allSessions = [
        ...(mySessionsData || []),
        ...invitedSessionsData,
        ...(publicSessionsData || [])
      ];
      const allSessionIds = allSessions.map(s => s.id);
      const hostIds = Array.from(new Set(allSessions.map(s => s.host_id)));

      // Fetch host profiles in a single batched query
      const { data: hostProfiles, error: hostError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', hostIds);

      if (hostError) {
        console.error('Error fetching host profiles:', hostError);
      }

      // Create a map from host_id to profile
      const profileById = new Map(hostProfiles?.map(p => [p.id, p]));

      // Fetch participant counts for all sessions
      const { data: participantCounts } = await supabase
        .from('session_participants')
        .select('session_id')
        .in('session_id', allSessionIds);

      const countMap = new Map<string, number>();
      participantCounts?.forEach(p => {
        countMap.set(p.session_id, (countMap.get(p.session_id) || 0) + 1);
      });

      // Attach participant counts and host profiles
      const enrichSessions = (sessions: StudySession[]): SessionWithDetails[] =>
        sessions.map(s => ({
          ...s,
          participant_count: countMap.get(s.id) || 0,
          host: profileById.get(s.host_id)
        }));

      setMySessions(enrichSessions(mySessionsData || []));
      setInvitedSessions(enrichSessions(invitedSessionsData));
      setPublicSessions(enrichSessions(publicSessionsData || []));
    } catch (err: any) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    mySessions,
    invitedSessions,
    publicSessions,
    loading,
    error,
    refetch: loadSessions
  };
}

export function useSessionDetail(sessionId: string | null, userId: string | null) {
  const [session, setSession] = useState<SessionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    if (!sessionId || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load session
      const { data: sessionData, error: sessionError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Load host profile
      const { data: hostProfile, error: hostError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.host_id)
        .single();

      if (hostError) throw hostError;

      // Load participants
      const { data: participants, error: participantsError } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId);

      if (participantsError) throw participantsError;

      // Load participant profiles
      const participantIds = participants?.map(p => p.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', participantIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.id, p]));
      const participantsWithProfiles = participants?.map(p => ({
        ...p,
        profile: profileMap.get(p.user_id)
      }));

      setSession({
        ...sessionData,
        host: hostProfile,
        participants: participantsWithProfiles,
        participant_count: participants?.length || 0
      });
    } catch (err: any) {
      console.error('Error loading session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return {
    session,
    loading,
    error,
    refetch: loadSession
  };
}

export async function createSession(
  userId: string,
  sessionData: {
    title: string;
    description: string;
    course_code: string;
    location: string;
    start_time: string;
    end_time: string;
    is_public: boolean;
    max_participants: number;
  }
) {
  // Insert session
  const { data: session, error: sessionError } = await supabase
    .from('study_sessions')
    .insert([
      {
        host_id: userId,
        ...sessionData
      }
    ])
    .select()
    .single();

  if (sessionError) throw sessionError;

  // Insert host as participant
  const { error: participantError } = await supabase
    .from('session_participants')
    .insert([
      {
        session_id: session.id,
        user_id: userId,
        role: 'host',
        status: 'accepted'
      }
    ]);

  if (participantError) throw participantError;

  return session;
}

export async function updateSession(
  sessionId: string,
  userId: string,
  sessionData: {
    title: string;
    description: string;
    course_code: string;
    location: string;
    start_time: string;
    end_time: string;
    is_public: boolean;
    max_participants: number;
  }
) {
  // Verify user is host
  const { data: session, error: checkError } = await supabase
    .from('study_sessions')
    .select('host_id')
    .eq('id', sessionId)
    .single();

  if (checkError) throw checkError;
  if (session.host_id !== userId) {
    throw new Error('Only the host can edit this session');
  }

  // Update session
  const { data, error } = await supabase
    .from('study_sessions')
    .update(sessionData)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function joinSession(sessionId: string, userId: string) {
  // Check capacity
  const { data: session, error: sessionError } = await supabase
    .from('study_sessions')
    .select('max_participants')
    .eq('id', sessionId)
    .single();

  if (sessionError) throw sessionError;

  const { count, error: countError } = await supabase
    .from('session_participants')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if (countError) throw countError;

  if (count && count >= session.max_participants) {
    throw new Error('Session is full');
  }

  // Check if already a participant
  const { data: existing } = await supabase
    .from('session_participants')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Update status if invited
    if (existing.status === 'invited') {
      const { error } = await supabase
        .from('session_participants')
        .update({ status: 'accepted' })
        .eq('id', existing.id);

      if (error) throw error;
      return;
    }
    return; // Already joined
  }

  // Join session
  const { error } = await supabase
    .from('session_participants')
    .insert([
      {
        session_id: sessionId,
        user_id: userId,
        role: 'participant',
        status: 'accepted'
      }
    ]);

  if (error) throw error;
}

export async function inviteToSession(
  sessionId: string,
  hostId: string,
  inviteeId: string
) {
  // Verify user is host
  const { data: session, error: checkError } = await supabase
    .from('study_sessions')
    .select('host_id, max_participants')
    .eq('id', sessionId)
    .single();

  if (checkError) throw checkError;
  if (session.host_id !== hostId) {
    throw new Error('Only the host can invite users');
  }

  // Check capacity
  const { count, error: countError } = await supabase
    .from('session_participants')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if (countError) throw countError;

  if (count && count >= session.max_participants) {
    throw new Error('Session is full');
  }

  // Check if already invited/joined
  const { data: existing } = await supabase
    .from('session_participants')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', inviteeId)
    .single();

  if (existing) {
    return; // Already invited or joined
  }

  // Send invite
  const { error } = await supabase
    .from('session_participants')
    .insert([
      {
        session_id: sessionId,
        user_id: inviteeId,
        role: 'invited',
        status: 'invited'
      }
    ]);

  if (error) throw error;
}

export async function getMatchedUsers(userId: string): Promise<Profile[]> {
  // Get matches where user is either user1 or user2
  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (matchError) throw matchError;

  if (!matches || matches.length === 0) return [];

  // Extract matched user IDs
  const matchedIds = matches.map(m =>
    m.user1_id === userId ? m.user2_id : m.user1_id
  );

  // Fetch profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', matchedIds);

  if (profileError) throw profileError;

  return profiles || [];
}

export async function deleteSession(sessionId: string, userId: string) {
  // Verify user is host
  const { data: session, error: checkError } = await supabase
    .from('study_sessions')
    .select('host_id')
    .eq('id', sessionId)
    .single();

  if (checkError) throw checkError;
  if (session.host_id !== userId) {
    throw new Error('Only the host can delete this session');
  }

  // Delete session (cascade will handle participants)
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

