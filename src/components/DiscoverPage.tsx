import { useState } from 'react';
import { SwipeCard } from './SwipeCard';

const mockUsers = [
  {
    id: '1',
    name: 'Maxim Q.',
    major: 'Software Engineering',
    year: 'U2',
    courses: ['COMP302', 'COMP251', 'MMATH324', 'COMP321', 'CANS308'],
    availability: ['Mon 8-11pm', 'Wed 2-6pm'],
    studyStyle: ['Group Study', 'Problem Sets'],
    bio: 'I played too much Elden Ring, need to catch up on COMP251! Looking for study buddies who wanna discuss concepts and solve problems together.',
    image: '/images/maxim.jpg',
  },
  {
    id: '2',
    name: 'Cheela Z.',
    major: 'Computer Science',
    year: 'U2',
    courses: ['COMP302', 'COMP273', 'MATH323', 'PHIL210', 'HISP245'],
    availability: ['Tue 1-4pm', 'Thu 2-5pm'],
    studyStyle: ['Quiet Study', 'Practice Problems'],
    bio: "I'm so lost, hope to find someone to study together! Prefer library sessions.",
    image: '/images/monkey.jpg',
  },
  {
    id: '3',
    name: 'Benjamin Franklin',
    major: 'Political Science',
    year: 'U4',
    courses: ['HIST505', 'POLI360', 'POLI450', 'ECON305'],
    availability: ['Mon 10am-1pm', 'Fri 2-5pm'],
    studyStyle: ['Active Recall', 'Teaching Others'],
    bio: 'Passionate student of history and politics. Looking for study partners to negotiate course materials.',
    image: 'https://res.cloudinary.com/grand-canyon-university/image/fetch/w_750,h_564,c_fill,g_faces,q_auto/https://www.gcu.edu/sites/default/files/images/articles/419cbf347df385b8b5ae8e23dd1c1ebd1b1ca35a.jpg',
  },
  {
    id: '4',
    name: 'Jake Paul',
    major: 'Marketing',
    year: 'U0',
    courses: ['MGCR 222', 'MRKT 351', 'ENVR 202'],
    availability: ['Wed 4-7pm', 'Sat 10am-2pm'],
    studyStyle: ['Self-Oriented', 'Discussion Topics'],
    bio: 'WHATUP CREWW! ITS YA BOI JAKE PAUL here to find some study buddies to crush these marketing courses with me! LETS GET THIS BREAD!',
    image: 'https://ntvb.tmsimg.com/assets/assets/943387_v9_bb.jpg',
  },
  {
    id: '5',
    name: 'Wonyoung Jang',
    major: 'Psychology',
    year: 'U1',
    courses: ['PSYC213', 'PSYC212', 'FRSL105'],
    availability: ['Fri 6-11pm', 'Sat 10am-2pm'],
    studyStyle: ['Active Recall', 'Flashcards'],
    bio: 'Hi everyone! I am Wonyoung, a first-year psych student, looking for a study partner to ace finals with!',
    image: 'https://tse4.mm.bing.net/th/id/OIP.nbziaMpyfb0DYAbLlq7FnAHaLI?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
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
