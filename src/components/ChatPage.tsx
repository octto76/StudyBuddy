import { useState } from 'react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockChats = [
  {
    id: '1',
    name: 'Maxim Qu',
    course: 'COMP302',
    lastMessage: 'Hey! Want to study for the midterm1 together?',
    time: '2h ago',
    unread: true,
    image: '/images/maxim.jpg',
  },
  {
    id: '2',
    name: 'Cheela Z.',
    course: 'COMP273',
    lastMessage: 'Thanks for the help!',
    time: '5h ago',
    unread: false,
    image: '/images/monkey.jpg',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    course: 'Bio 1A',
    lastMessage: 'Are you free tomorrow?',
    time: '1d ago',
    unread: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'Maxim Qu',
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
    sender: 'Maxim Qu',
    text: "Same bruh, want to meet up later today to work on it together?",
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
    sender: 'Maxim Qu',
    text: "Sick, see you there at 3:30pm?",
    time: '10:36 AM',
    isMe: false,
  },
  {
    id: '6',
    sender: 'Me',
    text: "Bet",
    time: '10:38 AM',
    isMe: true,
  },
];

export function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-screen">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2>Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedChat.id === chat.id ? 'bg-gradient-to-r from-[#757bc8]/5 to-[#9fa0ff]/5' : ''
              }`}
            >
              <div className="relative">
                <ImageWithFallback
                  src={chat.image}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="truncate">{chat.name}</p>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={selectedChat.image}
              alt={selectedChat.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3>{selectedChat.name}</h3>
              <p className="text-sm text-gray-600">{selectedChat.course}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md ${msg.isMe ? 'order-2' : 'order-1'}`}>
                {!msg.isMe && (
                  <p className="text-xs text-gray-500 mb-1 ml-3">{msg.sender}</p>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.isMe
                      ? 'bg-gradient-to-r from-[#757bc8] to-[#9fa0ff] text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'text-right mr-3' : 'ml-3'}`}>
                  {msg.time}
                </p>
              </div>
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
                if (e.key === 'Enter') {
                  setMessage('');
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
