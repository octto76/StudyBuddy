import { motion, useMotionValue, useTransform } from "motion/react";
import { X, Heart, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SwipeCardProps {
  user: {
    id: string;
    name: string;
    major: string;
    year: string;
    courses: string[];
    availability: string[];
    bio: string;
    image: string;
  };
  onSwipe: (direction: "left" | "right" | "up") => void;
}

export function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 150) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
    >
      {/* Profile Image Section */}
      <div className="relative h-[320px]">
        <ImageWithFallback
          src={user.image}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Course Badge on Image */}
        <div className="absolute top-6 left-6">
          <span className="inline-block px-4 py-2 bg-linear-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl shadow-lg">
            {user.courses[0]}
          </span>
        </div>

        {/* Name & Basic Info on Image */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-white">{user.name}</h2>
            <span className="text-white/90">{user.year}</span>
          </div>
          <p className="text-white/90">{user.major}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-5">
        {/* Bio */}
        <div>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>

        {/* Current Courses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#757bc8] to-[#9fa0ff]" />
            <h4 className="text-sm text-gray-600">Currently Studying</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.courses.map((course) => (
              <span
                key={course}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#dab6fc]" />
            <h4 className="text-sm text-gray-600">Availability</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.availability.map((time) => (
              <span
                key={time}
                className="px-3 py-1.5 bg-[#dab6fc]/10 text-[#757bc8] rounded-lg text-sm"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 pt-2 flex justify-center gap-6">
        <button
          onClick={() => onSwipe("left")}
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-red-400 hover:bg-red-50 hover:scale-110 transition-all shadow-md"
        >
          <X className="w-7 h-7 text-red-500" />
        </button>

        <button
          onClick={() => onSwipe("right")}
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-green-400 hover:bg-green-50 hover:scale-110 transition-all shadow-md"
        >
          <Heart className="w-7 h-7 text-green-500" />
        </button>
      </div>
    </motion.div>
  );
}
