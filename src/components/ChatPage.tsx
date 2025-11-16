import { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useMatches } from "../hooks/useMatches";
import { useMessages } from "../hooks/useMessages";

// Demo messages for demo matches (coming from useMatches)
const demoMessages: Record<string, any[]> = {
  'demo-match-1': [
    {
      id: '1',
      sender: 'Maxim Q.',
      text: 'Hey! How are you doing with the cps homework?',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: '2',
      sender: 'Me',
      text: "I'm working through Q2a right now. It's pretty challenging!",
      time: '10:32 AM',
      isMe: true,
    },
    {
      id: '3',
      sender: 'Maxim Q.',
      text: 'Same bruh, want to meet up later today to work on it together?',
      time: '10:33 AM',
      isMe: false,
    },
    {
      id: '4',
      sender: 'Me',
      text: "Ouiiii, I'm free after 3pm. Redpath 2nd floor?",
      time: '10:35 AM',
      isMe: true,
    },
    {
      id: '5',
      sender: 'Maxim Q.',
      text: 'Sick, see you there at 3:30pm?',
      time: '10:36 AM',
      isMe: false,
    },
    {
      id: '6',
      sender: 'Me',
      text: 'Bet',
      time: '10:38 AM',
      isMe: true,
    },
  ],
  'demo-match-2': [
    {
      id: '1',
      sender: 'Cheela Z.',
      text: 'Thanks for the help with lazy programming!',
      time: '5:10 PM',
      isMe: false,
    },
  ],
  'demo-match-3': [
    {
      id: '1',
      sender: 'Jake Paul',
      text: 'Are you free to study tomorrow afternoon?',
      time: '1:00 PM',
      isMe: false,
    },
  ],
  'demo-match-4': [
    {
      id: '1',
      sender: 'Wonyoung Jang',
      text: 'Great session today! Same time next week?',
      time: '3:45 PM',
      isMe: false,
    },
  ],
  'demo-match-5': [
    {
      id: '1',
      sender: 'Jake Sim',
      text: 'Hey! Have you finished the greedy algorithms assignment?',
      time: '2:30 PM',
      isMe: false,
    },
    {
      id: '2',
      sender: 'Me',
      text: 'Not yet, still working on problem 3!',
      time: '2:32 PM',
      isMe: true,
    },
    {
      id: '3',
      sender: 'Jake Sim',
      text: 'I found a great resource for greedy algorithms!',
      time: '2:35 PM',
      isMe: false,
    },
  ],
  'demo-match-6': [
    {
      id: '1',
      sender: 'Kujo Jotaro',
      text: 'Can you explain that concept again?',
      time: '11:00 AM',
      isMe: false,
    },
  ],
};

export function ChatPage() {
  const { matches, loading: matchesLoading } = useMatches();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { messages, sendMessage: sendMsg } = useMessages(selectedMatchId);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [demoMessagesByMatch, setDemoMessagesByMatch] = useState(demoMessages);

  // Auto-select first match when matches load
  useEffect(() => {
    if (matches.length > 0 && !selectedMatchId) {
      setSelectedMatchId(matches[0].matchId);
    }
  }, [matches.length, selectedMatchId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, demoMessagesByMatch]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Handle demo chat messages (don't save to database)
    if (selectedMatchId?.startsWith('demo-')) {
      const newMsg = {
        id: `demo-msg-${Date.now()}`,
        sender: 'Me',
        text: message.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: true,
      };
      
      setDemoMessagesByMatch((prev) => ({
        ...prev,
        [selectedMatchId]: [...(prev[selectedMatchId] || []), newMsg],
      }));
      
      setMessage("");
      return;
    }

    // Handle real messages
    try {
      await sendMsg(message.trim());
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);
  const isDemoMatch = selectedMatchId?.startsWith('demo-match-');
  const currentMessages = isDemoMatch 
    ? (demoMessagesByMatch[selectedMatchId || ''] || [])
    : messages;

  if (matchesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#757bc8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chat Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {matches.map((match) => (
            <button
              key={match.matchId}
              onClick={() => setSelectedMatchId(match.matchId)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedMatchId === match.matchId
                  ? "bg-gradient-to-r from-[#757bc8]/10 to-[#9fa0ff]/10"
                  : ""
              }`}
            >
              <div className="relative">
                <ImageWithFallback
                  src={match.image}
                  alt={match.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {match.unread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between mb-1">
                  <p className="truncate font-medium">{match.name}</p>
                  <span className="text-xs text-gray-400">{match.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {match.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      {selectedMatch ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={selectedMatch.image}
                alt={selectedMatch.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{selectedMatch.name}</h3>
                <p className="text-sm text-gray-600">{selectedMatch.course}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start the conversation!</p>
                </div>
              </div>
            ) : (
              <>
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-md">
                      {!msg.isMe && (
                        <p className="text-xs text-gray-500 mb-1 ml-3">
                          {selectedMatch.name}
                        </p>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.isMe
                            ? "bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p
                        className={`text-xs text-gray-400 mt-1 ${
                          msg.isMe ? "text-right mr-1" : "ml-3"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#9fa0ff]"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white rounded-2xl hover:shadow-lg flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}
