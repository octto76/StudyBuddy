import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface ProfileSetupPageProps {
  onDone: () => void;
}

export default function ProfileSetupPage({ onDone }: ProfileSetupPageProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load and parse courses2.csv from public directory
    const loadCourses = async () => {
      try {
        const response = await fetch('/courses2.csv');
        const text = await response.text();
        
        // Parse CSV - skip header, extract all course codes
        const lines = text.split('\n').slice(1); // skip header
        const courses = lines
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        setAvailableCourses(courses);
      } catch (err) {
        console.error('Error loading courses:', err);
        // Fallback to some default courses if CSV fails to load
        setAvailableCourses([
          'CS 101', 'CS 170', 'CS 189', 'MATH 110', 'EECS 126',
          'PHYS 101', 'CHEM 101', 'BIOL 101', 'ECON 101'
        ]);
      }
    };

    loadCourses();
  }, []);

  // Only show courses when user is actively searching
  const filteredCourses = courseSearch.trim()
    ? availableCourses.filter(course =>
        course.toLowerCase().includes(courseSearch.toLowerCase())
      ).slice(0, 100) // Show max 100 results when searching
    : [];

  const toggleCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && subjectInput.trim()) {
      e.preventDefault();
      if (!currentSubjects.includes(subjectInput.trim())) {
        setCurrentSubjects([...currentSubjects, subjectInput.trim()]);
      }
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setCurrentSubjects(currentSubjects.filter(s => s !== subject));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Make sure the "avatars" bucket exists in Supabase Storage.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('No user found');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!bio.trim()) {
      setError('Please enter a bio');
      return;
    }

    if (selectedCourses.length === 0) {
      setError('Please select at least one course');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update profile with onboarding data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          program: program.trim() || null,
          year: year || null,
          bio: bio.trim(),
          current_subject: currentSubjects.join(', '),
          courses: selectedCourses,
          avatar_url: avatarUrl || null,
          has_onboarded: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Call onDone to notify App.tsx that onboarding is complete
      onDone();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to save profile');
      setLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#757bc8] to-[#e0c3fc] bg-clip-text text-transparent mb-2">
            Welcome to StudyBuddy! 🎓
          </h1>
          <p className="text-gray-600">Let's set up your profile to find the perfect study partners.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#757bc8] to-[#9fa0ff] flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials(fullName)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {uploadingImage && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
              required
            />
          </div>

          {/* Program */}
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
              Program
            </label>
            <input
              id="program"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g., Computer Science, Engineering, Mathematics..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
            >
              <option value="">Select your year</option>
              <option value="U0">U0</option>
              <option value="U1">U1</option>
              <option value="U2">U2</option>
              <option value="U3">U3</option>
              <option value="U4">U4</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about yourself *
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="I'm a CS student passionate about machine learning and looking for study partners..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Current Subjects */}
          <div>
            <label htmlFor="currentSubject" className="block text-sm font-medium text-gray-700 mb-2">
              What are you currently studying? (Press Enter to add)
            </label>
            
            {/* Selected subjects display */}
            {currentSubjects.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {currentSubjects.map(subject => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#8e94f2]/10 text-[#757bc8] text-sm rounded-full border border-[#8e94f2]/20"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="hover:bg-[#8e94f2]/20 rounded-full p-0.5 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <input
              id="currentSubject"
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={handleSubjectKeyDown}
              placeholder="e.g., Algorithms (press Enter to add more)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your courses *
            </label>
            
            {/* Selected courses display */}
            {selectedCourses.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedCourses.map(course => (
                  <span
                    key={course}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white text-sm rounded-full"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search box */}
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search courses (e.g., CS 170, MATH 110)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
            />

            {/* Course list - Only show when searching */}
            {courseSearch.trim() && (
              <div className="border border-gray-200 rounded-xl h-48 overflow-y-auto">
                {filteredCourses.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No courses found. Try a different search.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredCourses.map(course => (
                      <label
                        key={course}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course)}
                          onChange={() => toggleCourse(course)}
                          className="w-4 h-4 text-[#757bc8] border-gray-300 rounded focus:ring-[#757bc8]"
                        />
                        <span className="text-sm text-gray-700">{course}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {!courseSearch.trim() && (
              <p className="text-xs text-gray-500">
                Start typing to search for courses
              </p>
            )}
            
            <p className="text-xs text-gray-500">
              Selected {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}

