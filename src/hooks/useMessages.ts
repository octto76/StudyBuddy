import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface UIMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export function useMessages(matchId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!matchId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    loadMessages();
    subscribeToMessages();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [matchId, user]);

  const loadMessages = async () => {
    if (!matchId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const transformed: UIMessage[] = (data || []).map((msg: Message) => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'Me' : 'Partner',
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: msg.sender_id === user.id,
      }));

      setMessages(transformed);
    } catch (err: any) {
      console.error('Error loading messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!matchId || !user) return;

    // Unsubscribe from previous channel if exists
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    // Create new channel for this match
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          const uiMessage: UIMessage = {
            id: newMessage.id,
            sender: newMessage.sender_id === user.id ? 'Me' : 'Partner',
            text: newMessage.content,
            time: new Date(newMessage.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isMe: newMessage.sender_id === user.id,
          };

          setMessages((prev) => [...prev, uiMessage]);
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const sendMessage = async (content: string) => {
    if (!matchId || !user || !content.trim()) return;

    try {
      const { error: insertError } = await supabase.from('messages').insert({
        match_id: matchId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (insertError) throw insertError;

      // Message will be added via realtime subscription
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}

