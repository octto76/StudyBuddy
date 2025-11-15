import { useState } from "react";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Send } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const mockSession = {
  id: "1",
  title: "Political Debate Practice",
  course: "POLI 450",
  date: "Nov 16, 2025",
  time: "5:00 PM",
  duration: "3 hours",
  location: "Royal Victoria College Study Room",
  description:
    "Let's debate together about the politics surrounding the American government and how they relate to the wishes of the Founding Fathers",
  host: {
    name: "Benjamin Franklin",
    image:
      "https://res.cloudinary.com/grand-canyon-university/image/fetch/w_750,h_564,c_fill,g_faces,q_auto/https://www.gcu.edu/sites/default/files/images/articles/419cbf347df385b8b5ae8e23dd1c1ebd1b1ca35a.jpg",
    major: "Political Science & Economics",
  },
  participants: [
    {
      name: "Albert Einstein",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.jFo3bPJA8j7zMZp5EkEtFQHaFj%3Fcb%3Ducfimg2%26pid%3DApi%26ucfimg%3D1&f=1&ipt=c4cc08dbd04f01435a660a8c3579a10d99ded276286ccf442e12cda3c991c8b3",
      major: "Physics",
    },
    {
      name: "Maomao La",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F64%2Fd6%2F25%2F64d62592d8dcf12afdddda300d45e3b5.png&f=1&nofb=1&ipt=f528c09d23260b685310553067a012cc2623b7b93c134048b64b8317c7c33a2d",
      major: "Pharmacology & Political Science",
    },
    {
      name: "A cow",
      image:
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fkidspressmagazine.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fdreamstime_xl_155237.jpg&f=1&nofb=1&ipt=ff3d02b21da1938b4c82a5a8c1d9b24a82c4be617d7639abe431f2c66e6277bb",
      major: "Agricultural Studies",
    },
  ],
  maxParticipants: 8,
};

const mockChatMessages = [
  {
    id: "1",
    sender: "Benjamin Franklin",
    text: "Looking forward to talk American politics to all of you",
    time: "2:30 PM",
    isHost: true,
  },
  {
    id: "2",
    sender: "Albert Einstein",
    text: "If we start at 5, time might dilate and suddenly it’s 6:15. Happens to me all the time.",
    time: "2:45 PM",
    isHost: false,
  },
  {
    id: "3",
    sender: "Maomao La",
    text: "我可以在自习室里制毒吗？我不确定这是否允许。",
    time: "2:50 PM",
    isHost: false,
  },
  {
    id: "4",
    sender: "A cow",
    text: "MOOOOOOOOOOOOOOOOOOO!!!",
    time: "3:15 PM",
    isHost: false,
  },
];

interface SessionDetailPageProps {
  onNavigate: (page: string) => void;
}

export function SessionDetailPage({ onNavigate }: SessionDetailPageProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-screen">
      {/* Left Side - Session Info */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-8">
          <button
            onClick={() => onNavigate("sessions")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sessions
          </button>

          {/* Session Card */}
          <div className="bg-gradient-to-br from-[#757bc8]/10 to-[#e0c3fc]/10 rounded-3xl p-6 mb-6 border border-[#9fa0ff]/20">
            <h2 className="mb-3">{mockSession.title}</h2>
            <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm text-[#757bc8] rounded-lg text-sm mb-4">
              {mockSession.course}
            </span>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-[#8e94f2]" />
                <span>
                  {mockSession.date} at {mockSession.time}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-[#bbadff]" />
                <span>{mockSession.duration}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-[#dab6fc]" />
                <span>{mockSession.location}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{mockSession.description}</p>

            <button className="w-full py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-xl hover:shadow-lg transition-shadow">
              Join Session
            </button>
          </div>

          {/* Host */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
            <h3 className="mb-4">Host</h3>
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={mockSession.host.image}
                alt={mockSession.host.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p>{mockSession.host.name}</p>
                <p className="text-sm text-gray-600">
                  {mockSession.host.major}
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3>Participants</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {mockSession.participants.length + 1}/
                  {mockSession.maxParticipants}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {mockSession.participants.map((participant, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ImageWithFallback
                    src={participant.image}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">{participant.name}</p>
                    <p className="text-xs text-gray-500">{participant.major}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Group Chat */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h3>Group Chat</h3>
          <p className="text-sm text-gray-600">Session discussion</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockChatMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm">{msg.sender}</p>
                {msg.isHost && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded text-xs">
                    Host
                  </span>
                )}
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 inline-block max-w-lg border border-gray-200">
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">{msg.time}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setMessage("");
                }
              }}
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-2xl hover:shadow-lg transition-shadow flex items-center gap-2">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
