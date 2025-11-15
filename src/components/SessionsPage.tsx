import { Plus, Search, Calendar, MapPin, Users, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const mockSessions = [
  {
    id: "1",
    title: "Political Debate practice",
    course: "POLI 450",
    date: "Nov 16, 2025",
    time: "5:00 PM",
    duration: "3 hours",
    location: "Royal Victoria College Study Room",
    host: "Benjamin Franklin",
    hostImage:
      "https://res.cloudinary.com/grand-canyon-university/image/fetch/w_750,h_564,c_fill,g_faces,q_auto/https://www.gcu.edu/sites/default/files/images/articles/419cbf347df385b8b5ae8e23dd1c1ebd1b1ca35a.jpg",
    participants: 4,
    maxParticipants: 8,
    isPublic: true,
  },
  {
    id: "2",
    title: "COMP 202 Midterm Prep",
    course: "COMP 202",
    date: "Nov 17, 2025",
    time: "10:00 AM",
    duration: "2 hours",
    location: "Redpath Library, 3rd Floor",
    host: "Sandy Tian",
    hostImage:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Fdiscord-anime-pfp-polar-bear-e3gpnxwwlt3ou9f8.jpg&f=1&nofb=1&ipt=9230c40c48e3dea9c330f04bd1e3709bbf93058b6f0ad904b4ba947ee73bc84b",
    participants: 3,
    maxParticipants: 5,
    isPublic: true,
  },

  {
    id: "3",
    title: "Biology Lab Report Writing",
    course: "BIOL 219",
    date: "Nov 18, 2025",
    time: "10:00 AM",
    duration: "4 hours",
    location: "SSMU Lounge",
    host: "Evelyn Yu",
    hostImage:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F236x%2Fd9%2Fcc%2F51%2Fd9cc51df24552a404ee45a215f849324.jpg&f=1&nofb=1&ipt=bf24f5807bcdcacc0b6d04d6ba248b8f3b5f77f356e9f8a4a3ebeee741cccda2",
    participants: 1,
    maxParticipants: 3,
    isPublic: false,
  },
  {
    id: "4",
    title: "bro just come help me out of my slump :sob:",
    course: "COMP 302",
    date: "Nov 19, 2025",
    time: "4:00 PM",
    duration: "2 hours",
    location: "Trottier Floor 3",
    host: "Maxim Qu",
    hostImage: "/images/maxim.jpg",
    participants: 2,
    maxParticipants: 9,
    isPublic: true,
  },
  {
    id: "5",
    title: "Let's study together!",
    course: "MUPG 571",
    date: "Nov 20, 2025",
    time: "1:00 PM",
    duration: "2 hours",
    location: "Marvin Duchow Music Library",
    host: "Hatsune Miku",
    hostImage:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpfptown.com%2Fdownload%2Fpfptown%2F1696532739%2Fhatsune-miku-pfp-3994.png&f=1&nofb=1&ipt=d32f2c56bf18db25bff78ed99f8fec5324a053b16c058db72c93fa01f94a0494",
    participants: 1,
    maxParticipants: 7,
    isPublic: true,
  },
  {
    id: "6",
    title: "Lock In Session",
    course: "BIOL 335",
    date: "Nov 21, 2025",
    time: "5:00 PM",
    duration: "3 hours",
    location: "Schulich Library, 4th floor",
    host: "Jotaro Kujo",
    hostImage:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-wixmp-ed30a86b8c4ca887773594c2.wixmp.com%2Ff%2F9289a4c9-6589-483c-ad90-6289dd4cd763%2Fdk1zwlg-fdea3db0-ba82-4072-85a2-e4894b1e4e18.png%2Fv1%2Ffill%2Fw_894%2Ch_894%2Cq_70%2Cstrp%2Fjotaro_kujo_pfp_by_lolhorsebagel_dk1zwlg-pre.jpg%3Ftoken%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzkyODlhNGM5LTY1ODktNDgzYy1hZDkwLTYyODlkZDRjZDc2M1wvZGsxendsZy1mZGVhM2RiMC1iYTgyLTQwNzItODVhMi1lNDg5NGIxZTRlMTgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.mH8AftdYLM459hAeymUlziXSKxoE74DqEMDum5bda5g&f=1&nofb=1&ipt=56a78ace4ff2d20b1098f483edcb5aae722de380d0e5fc035e7634de1fe008ec",
    participants: 4,
    maxParticipants: 4,
    isPublic: true,
  },
];

interface SessionsPageProps {
  onNavigate: (page: string, sessionId?: string) => void;
}

export function SessionsPage({ onNavigate }: SessionsPageProps) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Study Sessions</h1>
          <p className="text-gray-600">Discover and join study sessions</p>
        </div>
        <button
          onClick={() => onNavigate("create-session")}
          className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
            />
          </div>

          <select className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]">
            <option>All Courses</option>
            <option>CS 170</option>
            <option>Math 110</option>
            <option>Bio 1A</option>
          </select>

          <select className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]">
            <option>All Dates</option>
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onNavigate("session-detail", session.id)}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#9fa0ff] hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-2">{session.title}</h3>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#757bc8]/10 to-[#9fa0ff]/10 text-[#757bc8] rounded-lg text-sm">
                  {session.course}
                </span>
              </div>
              {!session.isPublic && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
                  Private
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#8e94f2]" />
                <span>
                  {session.date} at {session.time}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#bbadff]" />
                <span>{session.duration}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#dab6fc]" />
                <span>{session.location}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={session.hostImage}
                  alt={session.host}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600">
                  Hosted by {session.host}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {session.participants}/{session.maxParticipants}
                </span>
              </div>
            </div>

            {/* Join Button */}
            <button className="w-full mt-4 py-2 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow">
              {session.participants >= session.maxParticipants
                ? "Session Full"
                : "Join Session"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
