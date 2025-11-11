import { useState, useEffect } from 'react';
import { MessageSquare, Mic, Send, Settings, Volume2, FileText, BookOpen, GraduationCap, Accessibility, Moon, Sun, Type } from 'lucide-react';
import { sendMessageToFlowXO, type UserContext } from '../services/flowxoApi';

interface ChatbotInterfaceProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatbotInterface({ onNavigate }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Baho Tech AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [userId] = useState(() => `user_${Date.now()}`);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Call FlowXO API with user context
      const context: UserContext = {
        userId,
        sessionId,
        selectedService: activeMenu !== 'chat' ? activeMenu as any : undefined,
        userPreferences: {
          fontSize,
          highContrast
        }
      };

      const response = await sendMessageToFlowXO(messageText, context);

      // Add bot responses
      if (response.success && response.messages.length > 0) {
        const botResponses = response.messages.map((msg, index) => ({
          id: messages.length + 2 + index,
          text: msg.text,
          sender: 'bot' as const,
          timestamp: new Date()
        }));
        
        setMessages(prev => [...prev, ...botResponses]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response
      const botResponse: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const menuItems = [
    { id: 'voice-to-text', label: 'Voice-to-Text for Deaf', icon: Mic },
    { id: 'text-to-speech', label: 'Text-to-Speech for Mute', icon: Volume2 },
    { id: 'resources', label: 'Accessibility Resources', icon: FileText },
    { id: 'tutorials', label: 'Tutorials & Training', icon: GraduationCap }
  ];

  const fontSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${highContrast ? 'bg-yellow-400' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2]'} px-8 py-4 flex items-center justify-between shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${highContrast ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
            <Accessibility className={`w-6 h-6 ${highContrast ? 'text-yellow-400' : 'text-[#4A00E0]'}`} />
          </div>
          <span className={`${highContrast ? 'text-black' : 'text-white'} text-xl`}>Baho Tech Support</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full ${highContrast ? 'bg-black text-yellow-400' : 'bg-white/20 text-white'} hover:bg-white/30 transition-colors`}
            aria-label="Accessibility Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className={`px-4 py-2 rounded-full ${highContrast ? 'bg-black text-yellow-400' : 'bg-white/20 text-white'} hover:bg-white/30 transition-colors`}
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Accessibility Settings Panel */}
      {showSettings && (
        <div className={`${highContrast ? 'bg-yellow-400' : 'bg-white'} border-b ${highContrast ? 'border-black' : 'border-gray-200'} px-8 py-4`}>
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Type className={highContrast ? 'text-black' : 'text-gray-700'} />
              <span className={highContrast ? 'text-black' : 'text-gray-700'}>Font Size:</span>
              <div className="flex gap-2">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-3 py-1 rounded-lg ${
                      fontSize === size
                        ? highContrast ? 'bg-black text-yellow-400' : 'bg-[#4A00E0] text-white'
                        : highContrast ? 'bg-white text-black border-2 border-black' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {highContrast ? <Sun className="text-black" /> : <Moon className="text-gray-700" />}
              <span className={highContrast ? 'text-black' : 'text-gray-700'}>High Contrast:</span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  highContrast ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 ${highContrast ? 'right-1 bg-yellow-400' : 'left-1 bg-white'} w-6 h-6 rounded-full transition-all`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar Menu */}
        <aside className={`w-80 ${highContrast ? 'bg-black border-r-4 border-yellow-400' : 'bg-white border-r border-gray-200'} p-6`}>
          <h2 className={`${highContrast ? 'text-yellow-400' : 'text-gray-900'} mb-6`}>
            Services
          </h2>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeMenu === item.id
                      ? highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white shadow-lg'
                      : highContrast ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className={fontSizes[fontSize as keyof typeof fontSizes]}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={`mt-8 p-4 rounded-xl ${highContrast ? 'bg-yellow-400/20 border-2 border-yellow-400' : 'bg-gradient-to-br from-[#4A00E0]/10 to-[#8E2DE2]/10 border border-[#4A00E0]/20'}`}>
            <h3 className={`${highContrast ? 'text-yellow-400' : 'text-[#4A00E0]'} mb-2`}>
              Upgrade to Premium
            </h3>
            <p className={`${highContrast ? 'text-yellow-400' : 'text-gray-600'} text-sm mb-4`}>
              Unlock advanced features like real-time translation and IoT control.
            </p>
            <button
              onClick={() => onNavigate('pricing')}
              className={`w-full py-2 rounded-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white'} hover:shadow-lg transition-shadow`}
            >
              View Plans
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className={`flex-1 overflow-y-auto p-8 space-y-4 ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot'
                      ? highContrast ? 'bg-yellow-400' : 'bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2]'
                      : highContrast ? 'bg-white' : 'bg-gray-300'
                  }`}>
                    {message.sender === 'bot' ? (
                      <MessageSquare className={`w-5 h-5 ${highContrast ? 'text-black' : 'text-white'}`} />
                    ) : (
                      <div className={`w-5 h-5 rounded-full ${highContrast ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div>
                    <div className={`px-6 py-4 rounded-2xl ${
                      message.sender === 'bot'
                        ? highContrast ? 'bg-yellow-400 text-black' : 'bg-white shadow-md'
                        : highContrast ? 'bg-white text-black' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white'
                    } ${fontSizes[fontSize as keyof typeof fontSizes]}`}>
                      {message.text}
                    </div>
                    <div className={`text-xs ${highContrast ? 'text-yellow-400' : 'text-gray-500'} mt-1 px-2`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-2xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highContrast ? 'bg-yellow-400' : 'bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2]'}`}>
                    <MessageSquare className={`w-5 h-5 ${highContrast ? 'text-black' : 'text-white'}`} />
                  </div>
                  <div className={`px-6 py-4 rounded-2xl ${highContrast ? 'bg-yellow-400' : 'bg-white shadow-md'}`}>
                    <div className="flex gap-1">
                      <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-black' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-black' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-black' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className={`${highContrast ? 'bg-black border-t-4 border-yellow-400' : 'bg-white border-t border-gray-200'} p-6`}>
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button
                className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white'} hover:shadow-lg transition-shadow`}
                aria-label="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className={`flex-1 px-6 py-4 rounded-full ${
                  highContrast 
                    ? 'bg-white text-black border-4 border-yellow-400 placeholder-gray-700' 
                    : 'bg-gray-100 border border-gray-300 focus:border-[#4A00E0]'
                } outline-none transition-colors ${fontSizes[fontSize as keyof typeof fontSizes]}`}
              />
              
              <button
                onClick={handleSendMessage}
                className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white'} hover:shadow-lg transition-shadow`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
