import { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { useDiscover } from '../hooks/useDiscover';

export function DiscoverPage() {
  const { profiles, loading, error, swipe, reload } = useDiscover();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  useEffect(() => {
    // Reset index when profiles load
    setCurrentIndex(0);
  }, [profiles]);

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    
    // Handle swipe direction
    if (direction === 'right' || direction === 'up') {
      try {
        const result = await swipe(currentProfile.id, 'like');
        if (result?.isMatch) {
          setShowMatchAnimation(true);
          setTimeout(() => setShowMatchAnimation(false), 2000);
        }
      } catch (err) {
        console.error('Swipe error:', err);
      }
    } else if (direction === 'left') {
      try {
        await swipe(currentProfile.id, 'pass');
      } catch (err) {
        console.error('Swipe error:', err);
      }
    }
    
    // Move to next card with animation delay
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    reload(); // Reload profiles from database
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#757bc8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <p>Error loading profiles: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="relative w-full max-w-[420px]">
        {currentIndex < profiles.length ? (
          <SwipeCard
            key={profiles[currentIndex].id}
            user={profiles[currentIndex]}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-lg">
            <p className="text-gray-400 mb-4">No more profiles</p>
            <p className="text-sm text-gray-500 mb-4">Check back later for new study buddies!</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              Reset Stack
            </button>
          </div>
        )}
      </div>

      {/* Match Animation Overlay */}
      {showMatchAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#757bc8] mb-2">It's a Match!</h2>
            <p className="text-gray-600">You can now start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
