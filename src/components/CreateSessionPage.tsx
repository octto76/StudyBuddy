import { Calendar, MapPin, Book, Users, Lock, Globe } from 'lucide-react';
import { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function CreateSessionPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="mb-2">Create Study Session</h1>
        <p className="text-gray-600">Set up a new study session and invite buddies</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200">
        <form className="space-y-6">
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
            />
          </div>

          {/* Course */}
          <div>
            <Label htmlFor="course" className="text-sm text-gray-700 mb-2 flex items-center gap-2">
              <Book className="w-4 h-4 text-[#757bc8]" />
              Course
            </Label>
            <select
              id="course"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
            >
              <option>Select a course</option>
              <option>CS 170 - Algorithms</option>
              <option>CS 189 - Machine Learning</option>
              <option>Math 110 - Linear Algebra</option>
              <option>Bio 1A - General Biology</option>
              <option>Econ 101 - Microeconomics</option>
            </select>
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
            >
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3 hours</option>
              <option>4 hours</option>
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
            />
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#757bc8]" />
                <div>
                  <Label htmlFor="locked" className="cursor-pointer">Lock Session (2 people max)</Label>
                  <p className="text-sm text-gray-500">Create a one-on-one study session</p>
                </div>
              </div>
              <Switch
                id="locked"
                checked={isLocked}
                onCheckedChange={setIsLocked}
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
            className="w-full py-4 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            Create Study Session
          </button>
        </form>
      </div>
    </div>
  );
}
