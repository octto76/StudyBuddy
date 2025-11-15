import { useState } from 'react';
import { SwipeCard } from './SwipeCard';

const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    major: 'Computer Science',
    year: 'Junior',
    courses: ['CS 161', 'CS 170', 'Math 54'],
    availability: ['Mon 2-5pm', 'Wed 3-6pm'],
    studyStyle: ['Group Study', 'Problem Sets'],
    bio: 'Looking for a study partner for algorithms! I like working through problems together and explaining concepts.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    major: 'Mathematics',
    year: 'Sophomore',
    courses: ['Math 110', 'CS 70', 'Physics 7A'],
    availability: ['Tue 1-4pm', 'Thu 2-5pm'],
    studyStyle: ['Quiet Study', 'Flashcards'],
    bio: 'Math major seeking study buddies for discrete math and physics. Prefer library sessions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    major: 'Biology',
    year: 'Senior',
    courses: ['Bio 1A', 'Chem 3A', 'MCB 102'],
    availability: ['Mon 10am-1pm', 'Fri 2-5pm'],
    studyStyle: ['Active Recall', 'Teaching Others'],
    bio: 'Pre-med student looking for organic chemistry study partners. Love explaining concepts!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
  },
  {
    id: '4',
    name: 'Alex Kim',
    major: 'Economics',
    year: 'Junior',
    courses: ['Econ 101', 'Stat 134', 'CS 61A'],
    availability: ['Wed 4-7pm', 'Sat 10am-2pm'],
    studyStyle: ['Collaborative', 'Practice Problems'],
    bio: 'Econ + CS double major. Looking for partners for stats and programming projects!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
  },
];

export function DiscoverPage() {
  const [users, setUsers] = useState(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'right') {
      console.log('Liked:', users[currentIndex].name);
    } else if (direction === 'up') {
      console.log('Super liked:', users[currentIndex].name);
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="relative w-full max-w-[420px]">
        {currentIndex < users.length ? (
          <SwipeCard
            key={users[currentIndex].id}
            user={users[currentIndex]}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-lg">
            <p className="text-gray-400 mb-4">No more profiles</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              Reset Stack
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
