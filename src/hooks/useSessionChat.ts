import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { SessionMessage } from '../types';

interface UseSessionChatReturn {
  messages: SessionMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  sending: boolean;
}

export function useSessionChat(sessionId: string | null): UseSessionChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch messages and profiles
  const fetchMessages = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Get unique sender IDs
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];

      // Fetch profiles for all senders
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', senderIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user_id -> profile
      const profilesMap = new Map(
        profilesData?.map(p => [p.id, p]) || []
      );

      // Attach profiles to messages
      const enrichedMessages: SessionMessage[] = messagesData.map(msg => ({
        ...msg,
        sender_profile: profilesMap.get(msg.sender_id),
      }));

      setMessages(enrichedMessages);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !sessionId || !content.trim()) {
      return;
    }

    setSending(true);
    try {
      const { data, error: insertError } = await supabase
        .from('session_messages')
        .insert({
          session_id: sessionId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Fetch the sender's profile for the optimistic update
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Optimistically add message to local state
      const newMessage: SessionMessage = {
        ...data,
        sender_profile: profileData || undefined,
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, [user, sessionId]);

  // Setup realtime subscription
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    // Initial fetch
    fetchMessages(sessionId);

    // Setup realtime subscription
    const channel = supabase
      .channel(`session_messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          const newMessage = payload.new as SessionMessage;

          // Don't add if it's from the current user (already optimistically added)
          if (newMessage.sender_id === user?.id) {
            return;
          }

          // Fetch the sender's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const enrichedMessage: SessionMessage = {
            ...newMessage,
            sender_profile: profileData || undefined,
          };

          setMessages(prev => {
            // Check if message already exists
            if (prev.some(m => m.id === enrichedMessage.id)) {
              return prev;
            }
            return [...prev, enrichedMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sessionId, fetchMessages, user?.id]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    sending,
  };
}

