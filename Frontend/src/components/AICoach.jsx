import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const COACH_TYPES = {
  supportive: {
    name: "Coach Alex",
    description: "Supportive & encouraging",
    icon: "❤️",
    color: "bg-green-500/20 text-green-400"
  },
  strict: {
    name: "Coach Drill",
    description: "Strict & no-nonsense",
    icon: "💪",
    color: "bg-red-500/20 text-red-400"
  },
  funny: {
    name: "Coach Chuckles",
    description: "Witty & humorous",
    icon: "😄",
    color: "bg-yellow-500/20 text-yellow-400"
  },
  analytical: {
    name: "Coach Logic",
    description: "Data-driven & methodical",
    icon: "📊",
    color: "bg-blue-500/20 text-blue-400"
  },
  motivational: {
    name: "Coach Spark",
    description: "Energetic & inspiring",
    icon: "⚡",
    color: "bg-purple-500/20 text-purple-400"
  }
};

const AICoach = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [coachType, setCoachType] = useState('supportive');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);

  // Get stored messages from local storage
  useEffect(() => {
    const storedMessages = localStorage.getItem('coachMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Add welcome message
      const welcomeMessage = {
        text: `Hi there! I'm ${COACH_TYPES[coachType].name}, your AI habit coach. How can I help with your habits today?`,
        sender: 'coach',
        coachType,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
    
    const storedCoachType = localStorage.getItem('coachType');
    if (storedCoachType) {
      setCoachType(storedCoachType);
    }
  }, []);

  // Save messages to local storage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('coachMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save coach type to local storage when it changes
  useEffect(() => {
    localStorage.setItem('coachType', coachType);
  }, [coachType]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to the chat
    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coach`,
        {
          message: message.trim(),
          coachType
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Add coach's response to the chat
      const coachMessage = {
        text: response.data.message,
        sender: 'coach',
        coachType,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, coachMessage]);
    } catch (error) {
      console.error('Error getting coach response:', error);
      toast.error('Failed to get coach response');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Add a new welcome message
    const welcomeMessage = {
      text: `Hi there! I'm ${COACH_TYPES[coachType].name}, your AI habit coach. How can I help with your habits today?`,
      sender: 'coach',
      coachType,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  const changeCoachType = (newType) => {
    setCoachType(newType);
    setShowPersonalitySelector(false);
    
    // Add coach transition message
    const transitionMessage = {
      text: `I'm now ${COACH_TYPES[newType].name}, your ${COACH_TYPES[newType].description} habit coach. How can I help you today?`,
      sender: 'coach',
      coachType: newType,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, transitionMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Coach header */}
      <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${COACH_TYPES[coachType].color} flex items-center justify-center text-xl`}>
              {COACH_TYPES[coachType].icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{COACH_TYPES[coachType].name}</h3>
              <p className="text-sm text-[#f5f5f7]/60">{COACH_TYPES[coachType].description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Change Coach
            </motion.button>
            <motion.button
              onClick={clearChat}
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Chat
            </motion.button>
          </div>
        </div>
        
        {/* Personality selector dropdown */}
        {showPersonalitySelector && (
          <motion.div 
            className="mt-3 bg-[#1a1a1a] border border-[#222] rounded-lg p-2 absolute z-10 w-[calc(100%-3rem)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-[#f5f5f7]/60 mb-2">Select coach personality:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(COACH_TYPES).map(([type, details]) => (
                <motion.button
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-lg hover:bg-[#222] text-left ${coachType === type ? 'border border-[#A2BFFE]' : ''}`}
                  onClick={() => changeCoachType(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-full ${details.color} flex items-center justify-center text-lg`}>
                    {details.icon}
                  </div>
                  <div>
                    <p className="font-medium">{details.name}</p>
                    <p className="text-xs text-[#f5f5f7]/60">{details.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] border border-[#222] rounded-xl p-4 mb-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-[#A2BFFE] text-[#080808]' 
                    : msg.coachType ? `${COACH_TYPES[msg.coachType].color} bg-opacity-20` : 'bg-[#1a1a1a]'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] p-3 rounded-lg ${COACH_TYPES[coachType].color} bg-opacity-20`}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your habit coach for advice..."
            className="flex-1 bg-[#1a1a1a] text-[#f5f5f7] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50"
            disabled={loading}
          />
          <motion.button
            type="submit"
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-2 rounded-lg font-bold disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading || !message.trim()}
          >
            Send
          </motion.button>
        </div>
        <p className="text-xs text-[#f5f5f7]/40 mt-2">
          Your AI coach uses Groq to provide personalized habit advice
        </p>
      </form>
    </div>
  );
};

export default AICoach;