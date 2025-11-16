import { Calendar, MapPin, Book, Users, Globe, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAuth } from '../context/AuthContext';
import { createSession, updateSession } from '../hooks/useSessions';
import type { StudySession } from '../types';

interface CreateSessionPageProps {
  onNavigate: (page: string) => void;
  editSession?: StudySession | null;
}

export function CreateSessionPage({ onNavigate, editSession }: CreateSessionPageProps) {
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(editSession?.is_public ?? true);
  const [title, setTitle] = useState(editSession?.title || '');
  const [courseCode, setCourseCode] = useState(editSession?.course_code || '');
  const [date, setDate] = useState(
    editSession?.start_time ? new Date(editSession.start_time).toISOString().split('T')[0] : ''
  );
  const [time, setTime] = useState(
    editSession?.start_time ? new Date(editSession.start_time).toTimeString().slice(0, 5) : ''
  );
  const [duration, setDuration] = useState('2');
  const [location, setLocation] = useState(editSession?.location || '');
  const [description, setDescription] = useState(editSession?.description || '');
  const [maxParticipants, setMaxParticipants] = useState(editSession?.max_participants?.toString() || '8');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a session');
      return;
    }

    if (!title || !courseCode || !date || !time || !location) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + parseInt(duration));

      const sessionData = {
        title,
        description,
        course_code: courseCode,
        location,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_public: isPublic,
        max_participants: parseInt(maxParticipants) || 8
      };

      if (editSession) {
        await updateSession(editSession.id, user.id, sessionData);
      } else {
        await createSession(user.id, sessionData);
      }

      onNavigate('sessions');
    } catch (err: any) {
      console.error('Error saving session:', err);
      setError(err.message || 'Failed to save session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={() => onNavigate('sessions')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Sessions
      </button>

      <div className="mb-8">
        <h1 className="mb-2">{editSession ? 'Edit Study Session' : 'Create Study Session'}</h1>
        <p className="text-gray-600">Set up a new study session and invite buddies</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 border border-gray-200">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm text-gray-700 mb-2 block">
              Session Title
            </Label>
            <input
              id="title"
              type="text"
              placeholder="e.g., CS 170 Midterm Prep"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Course */}
          <div>
            <Label htmlFor="course" className="text-sm text-gray-700 mb-2 flex items-center gap-2">
              <Book className="w-4 h-4 text-[#757bc8]" />
              Course
            </Label>
            <input
              id="course"
              type="text"
              placeholder="e.g., COMP 202"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8e94f2]" />
                Date
              </Label>
              <input
                id="date"
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="time" className="text-sm text-gray-700 mb-2 block">
                Time
              </Label>
              <input
                id="time"
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm text-gray-700 mb-2 block">
              Duration (hours)
            </Label>
            <select
              id="duration"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#bbadff]" />
              Location
            </Label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Main Library, 3rd Floor"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm text-gray-700 mb-2 block">
              Description (Optional)
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Add details about what you'll be studying..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <Label htmlFor="maxParticipants" className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#757bc8]" />
                Max Participants
              </Label>
              <input
                id="maxParticipants"
                type="number"
                min="2"
                max="50"
                placeholder="e.g., 8"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#8e94f2]" />
                <div>
                  <Label htmlFor="public" className="cursor-pointer">Public Session</Label>
                  <p className="text-sm text-gray-500">Anyone can discover and join</p>
                </div>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (editSession ? 'Update Study Session' : 'Create Study Session')}
          </button>
        </form>
      </div>
    </div>
  );
}
