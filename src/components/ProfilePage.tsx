import { useEffect, useState, useRef } from 'react';
import { Edit, Book, Target, LogOut, Camera, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabaseClient';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, setProfile } = useProfile();
  const [stats, setStats] = useState({
    matches: 0,
    sessions: 0,
    hours: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSubjects, setEditSubjects] = useState<string[]>([]);
  const [editSubjectInput, setEditSubjectInput] = useState('');
  const [editCourses, setEditCourses] = useState<string[]>([]);
  const [editCourseSearch, setEditCourseSearch] = useState('');
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !profile) return;

    const fetchStats = async () => {
      try {
        // Fetch number of matches
        const { count: matchCount } = await supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        // Fetch number of sessions
        const { count: sessionCount } = await supabase
          .from('session_participants')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats({
          matches: matchCount || 0,
          sessions: sessionCount || 0,
          hours: profile.study_hours || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, profile]);

  // Load courses when edit mode is activated
  useEffect(() => {
    if (isEditMode && availableCourses.length === 0) {
      const loadCourses = async () => {
        try {
          const response = await fetch('/courses2.csv');
          const text = await response.text();
          const lines = text.split('\n').slice(1);
          const courses = lines.map(line => line.trim()).filter(line => line.length > 0);
          setAvailableCourses(courses);
        } catch (err) {
          console.error('Error loading courses:', err);
        }
      };
      loadCourses();
    }
  }, [isEditMode, availableCourses.length]);

  // Initialize edit form when entering edit mode
  useEffect(() => {
    if (isEditMode && profile) {
      setEditFullName(profile.full_name || '');
      setEditProgram(profile.program || '');
      setEditYear(profile.year || '');
      setEditBio(profile.bio || '');
      setEditSubjects(profile.current_subject ? profile.current_subject.split(', ').filter(Boolean) : []);
      setEditCourses(profile.courses || []);
      setEditAvatarUrl(profile.avatar_url || '');
    }
  }, [isEditMode, profile]);

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return profile.username.substring(0, 2).toUpperCase();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const currentlyStudying = profile.current_subject
    ? profile.current_subject.split(',').map(s => s.trim()).filter(Boolean)
    : [];

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

      setEditAvatarUrl(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Make sure the "avatars" bucket exists in Supabase Storage.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editSubjectInput.trim()) {
      e.preventDefault();
      if (!editSubjects.includes(editSubjectInput.trim())) {
        setEditSubjects([...editSubjects, editSubjectInput.trim()]);
      }
      setEditSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setEditSubjects(editSubjects.filter(s => s !== subject));
  };

  const toggleCourse = (course: string) => {
    if (editCourses.includes(course)) {
      setEditCourses(editCourses.filter(c => c !== course));
    } else {
      setEditCourses([...editCourses, course]);
    }
  };

  // Only show courses when user is actively searching
  const filteredCoursesForEdit = editCourseSearch.trim()
    ? availableCourses.filter(course =>
        course.toLowerCase().includes(editCourseSearch.toLowerCase())
      ).slice(0, 100)
    : [];

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSavingProfile(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: editFullName.trim() || null,
          program: editProgram.trim() || null,
          year: editYear || null,
          bio: editBio.trim() || null,
          current_subject: editSubjects.join(', '),
          courses: editCourses,
          avatar_url: editAvatarUrl || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local profile state
      setProfile({
        ...profile,
        full_name: editFullName.trim() || null,
        program: editProgram.trim() || null,
        year: editYear || null,
        bio: editBio.trim() || null,
        current_subject: editSubjects.join(', '),
        courses: editCourses,
        avatar_url: editAvatarUrl || null,
      });

      setIsEditMode(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditCourseSearch('');
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>My Profile</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditMode(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button 
            onClick={signOut}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
        <div className="flex gap-6">
          {profile.avatar_url ? (
            <ImageWithFallback
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              className="w-32 h-32 rounded-3xl object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#757bc8] to-[#9fa0ff] flex items-center justify-center text-white text-4xl font-bold">
              {getInitials(profile.full_name)}
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="mb-1">{profile.full_name || profile.username}</h2>
            <p className="text-gray-500 text-sm mb-1">@{profile.username}</p>
            {(profile.program || profile.year) && (
              <p className="text-gray-600 mb-3">
                {[profile.program, profile.year].filter(Boolean).join(' · ')}
              </p>
            )}
            
            <p className="text-gray-700 mb-6">{profile.bio || 'No bio yet.'}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-[#757bc8]/10 to-[#9fa0ff]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] bg-clip-text text-transparent mb-1">
                  {loadingStats ? '...' : stats.matches}
                </div>
                <p className="text-sm text-gray-600">Matches</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#8e94f2]/10 to-[#bbadff]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#8e94f2] to-[#bbadff] bg-clip-text text-transparent mb-1">
                  {loadingStats ? '...' : stats.sessions}
                </div>
                <p className="text-sm text-gray-600">Sessions</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#dab6fc]/10 to-[#e0c3fc]/10 rounded-2xl">
                <div className="bg-gradient-to-r from-[#dab6fc] to-[#e0c3fc] bg-clip-text text-transparent mb-1">
                  {loadingStats ? '...' : stats.hours}
                </div>
                <p className="text-sm text-gray-600">Study Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Card */}
      {profile.courses && profile.courses.length > 0 && (
        <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Book className="w-5 h-5 text-[#757bc8]" />
            <h3>Current Courses</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.courses.map((course) => (
              <Badge
                key={course}
                className="px-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white border-0"
              >
                {course}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Currently Studying */}
      {currentlyStudying.length > 0 && (
        <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-[#8e94f2]" />
            <h3>Currently Studying</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {currentlyStudying.map((topic) => (
              <Badge
                key={topic}
                className="px-4 py-2 bg-[#8e94f2]/10 text-[#757bc8] border border-[#8e94f2]/20"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#757bc8] to-[#9fa0ff] flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(editFullName)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5 text-gray-700" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
                />
              </div>

              {/* Program */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program
                </label>
                <input
                  type="text"
                  value={editProgram}
                  onChange={(e) => setEditProgram(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent resize-none"
                />
              </div>

              {/* Current Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currently Studying (Press Enter to add)
                </label>
                {editSubjects.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {editSubjects.map(subject => (
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
                  type="text"
                  value={editSubjectInput}
                  onChange={(e) => setEditSubjectInput(e.target.value)}
                  onKeyDown={handleSubjectKeyDown}
                  placeholder="e.g., Algorithms"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
                />
              </div>

              {/* Courses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courses
                </label>
                {editCourses.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {editCourses.map(course => (
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
                <input
                  type="text"
                  value={editCourseSearch}
                  onChange={(e) => setEditCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#757bc8] focus:border-transparent"
                />
                
                {/* Course list - Only show when searching */}
                {editCourseSearch.trim() && (
                  <div className="border border-gray-200 rounded-xl h-48 overflow-y-auto mt-3">
                    {filteredCoursesForEdit.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No courses found. Try a different search.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredCoursesForEdit.map(course => (
                          <label
                            key={course}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={editCourses.includes(course)}
                              onChange={() => toggleCourse(course)}
                              className="w-4 h-4 text-[#757bc8] border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{course}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {!editCourseSearch.trim() && (
                  <p className="text-xs text-gray-500 mt-2">
                    Start typing to search for courses
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={savingProfile}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
