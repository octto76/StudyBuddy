import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';

// Helper function to format time from 24h to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes}${ampm}`;
}

interface DiscoverProfile {
  id: string;
  name: string;
  major: string;
  year: string;
  courses: string[];
  availability: string[];
  studyStyle: string[];
  bio: string;
  image: string;
}

export function useDiscover() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch only LIKED swipes by the current user to build a blocklist
      // We exclude liked profiles but allow passed profiles to show again
      const { data: swipes, error: swipesError } = await supabase
        .from('swipes')
        .select('target_id')
        .eq('swiper_id', user.id)
        .eq('direction', 'like');

      if (swipesError) throw swipesError;

      const blocklist = swipes?.map((s) => s.target_id) || [];

      // 2. Fetch profiles excluding current user and already LIKED users
      // Passed profiles will still appear (allowing users to reconsider)
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .eq('has_onboarded', true);

      // Only apply blocklist filter if there are liked users
      if (blocklist.length > 0) {
        query = query.not('id', 'in', `(${blocklist.join(',')})`);
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // 3. Transform to UI format
      const transformed: DiscoverProfile[] = (profilesData || []).map((profile: Profile) => {
        // Transform availability slots to human-readable format
        const availabilityStrings = (profile.availability || []).map(slot => {
          const dayMap: Record<string, string> = {
            mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', 
            fri: 'Fri', sat: 'Sat', sun: 'Sun'
          };
          const dayName = dayMap[slot.day.toLowerCase()] || slot.day;
          const startTime = formatTime(slot.start);
          const endTime = formatTime(slot.end);
          return `${dayName} ${startTime}-${endTime}`;
        });

        return {
          id: profile.id,
          name: profile.username || 'Anonymous',
          major: profile.program || 'Unknown Program',
          year: profile.year || 'U0',
          courses: profile.courses || [],
          availability: availabilityStrings,
          studyStyle: [], // Not stored in current schema, using empty array
          bio: profile.bio || 'No bio provided',
          image: profile.avatar_url || 'https://via.placeholder.com/400',
        };
      });

      setProfiles(transformed);
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const swipe = async (targetId: string, direction: 'like' | 'pass') => {
    if (!user) return;

    try {
      // 1. Insert swipe
      const { error: swipeError } = await supabase.from('swipes').upsert({
        swiper_id: user.id,
        target_id: targetId,
        direction,
      });

      if (swipeError) throw swipeError;

      // 2. If it's a like, check for mutual match
      if (direction === 'like') {
        const { data: reciprocalSwipe, error: reciprocalError } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', targetId)
          .eq('target_id', user.id)
          .eq('direction', 'like')
          .maybeSingle();

        if (reciprocalError) throw reciprocalError;

        // 3. If mutual, create match
        if (reciprocalSwipe) {
          const [user1, user2] = [user.id, targetId].sort();
          
          const { error: matchError } = await supabase.from('matches').upsert({
            user1_id: user1,
            user2_id: user2,
          });

          if (matchError) throw matchError;

          return { isMatch: true };
        }
      }

      return { isMatch: false };
    } catch (err: any) {
      console.error('Error swiping:', err);
      throw err;
    }
  };

  return {
    profiles,
    loading,
    error,
    swipe,
    reload: loadProfiles,
  };
}

