import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";


const Challenges = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [challenges, setChallenges] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });
  
  // Fetch all challenges
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/challenges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Process challenges to identify user's participations
      const challenges = response.data;
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      
      const participations = challenges.filter(challenge => 
        challenge.participants.some(p => p.user === userId || p.user?._id === userId)
      );
      
      setChallenges(challenges);
      setMyParticipations(participations);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      toast.error("Failed to load challenges");
      setLoading(false);
    }
  };

  // Join a challenge
  const joinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenges/${challengeId}/join`,
        {user:user ? JSON.parse(user) : undefined},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Successfully joined challenge!");
      fetchChallenges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join challenge");
    }
  };

  // Update progress for a challenge
  const updateProgress = async (challengeId, progress) => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenges/${challengeId}/progress`,
        { progress
, user: user ? JSON.parse(user) : undefined
         },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Progress updated successfully!");
      fetchChallenges();
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  // Create a new challenge
  const createChallenge = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenges`,
        {
          ...formData,
          user: user ? JSON.parse(user) : undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      toast.success("Challenge created successfully!");
      setShowCreateModal(false);
      setFormData({
        name: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchChallenges();
    } catch (error) {
      toast.error("Failed to create challenge");
    }
  };

  // Initialize Fluvio for real-time updates
  const initWebSocket = () => {
    // Determine WebSocket URL based on environment
    const wsUrl = import.meta.env.DEV 
    ? `ws://localhost:8000` 
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    
  const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    
    // Change this part in your onmessage handler
socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Handle history updates (sent when first connecting)
      if (data.type === 'history' && Array.isArray(data.updates)) {
        setUpdates(data.updates);
      } 
      // Handle normal updates
      else {
        setUpdates(prev => [data, ...prev].slice(0, 20));
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Return cleanup function
    return () => {
      socket.close();
    };
  };
  
  // Update useEffect
  useEffect(() => {
    fetchChallenges();
    const cleanup = initWebSocket();
    return cleanup;
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f5f7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2BFFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] py-8">
      <main className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Social Challenges</h1>
            <p className="text-[#f5f5f7]/60">
              Join challenges and build habits together
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-lg font-bold text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Challenge
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#222]">
          {["explore", "my-challenges", "live-updates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 relative ${
                activeTab === tab
                  ? "text-[#A2BFFE]"
                  : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
              }`}
            >
              {tab === "explore" 
                ? "Explore" 
                : tab === "my-challenges" 
                  ? "My Challenges" 
                  : "Live Updates"}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A2BFFE]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {challenges.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-xl font-bold mb-2">No Challenges Available</h3>
                  <p className="text-[#f5f5f7]/60 mb-6">
                    Be the first to create a challenge for the community!
                  </p>
                </div>
              ) : (
                challenges.map((challenge) => {
                  // Check if user is already a participant
                  const token = localStorage.getItem("token");
                  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
                  const isParticipant = challenge.participants.some(
                    p => p.user === userId || p.user?._id === userId
                  );
                  
                  return (
                    <motion.div
                      key={challenge._id}
                      className="bg-[#0a0a0a] border border-[#222] rounded-xl p-5 hover:border-[#A2BFFE]/30"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-[#A2BFFE] mb-2">{challenge.name}</h3>
                      <p className="text-sm text-[#f5f5f7]/60 mb-3 line-clamp-2">
                        {challenge.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-[#222] px-2 py-1 rounded-full text-[#f5f5f7]/60">
                          {new Date(challenge.startDate).toLocaleDateString()} to {new Date(challenge.endDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-[#222] px-2 py-1 rounded-full text-[#f5f5f7]/60">
                          {challenge.participants.length} participants
                        </span>
                      </div>
                      
                      {isParticipant ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#A2BFFE]">You've joined</span>
                          <button 
                            className="text-xs bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-3 py-1.5 rounded-md"
                            onClick={() => setActiveTab("my-challenges")}
                          >
                            View Status
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => joinChallenge(challenge._id)}
                          className="w-full bg-[#222] hover:bg-[#333] text-[#f5f5f7] py-2 rounded-md text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Join Challenge
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {activeTab === "my-challenges" && (
            <motion.div
              key="my-challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {myParticipations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold mb-2">No Active Challenges</h3>
                  <p className="text-[#f5f5f7]/60 mb-6">
                    Join a challenge to start tracking your progress together!
                  </p>
                  <motion.button
                    onClick={() => setActiveTab("explore")}
                    className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-full font-bold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Challenges
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {myParticipations.map((challenge) => {
                    // Find user's participation
                    const token = localStorage.getItem("token");
                    const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
                    const myParticipation = challenge.participants.find(
                      p => p.user === userId || p.user?._id === userId
                    );
                    const progress = myParticipation?.progress || 0;
                    
                    return (
                      <motion.div
                        key={challenge._id}
                        className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-bold text-xl text-[#A2BFFE] mb-2">
                          {challenge.name}
                        </h3>
                        <p className="text-[#f5f5f7]/60 mb-4">
                          {challenge.description}
                        </p>
                        
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="text-[#A2BFFE]">{progress}%</span>
                          </div>
                          <div className="w-full bg-[#222] rounded-full h-2.5">
                            <div 
                              className="bg-[#A2BFFE] h-2.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                          <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-2 text-center flex-1">
                            <p className="text-xs text-[#f5f5f7]/60">Start Date</p>
                            <p className="text-sm font-medium">
                              {new Date(challenge.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-2 text-center flex-1">
                            <p className="text-xs text-[#f5f5f7]/60">End Date</p>
                            <p className="text-sm font-medium">
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-2 text-center flex-1">
                            <p className="text-xs text-[#f5f5f7]/60">Participants</p>
                            <p className="text-sm font-medium">{challenge.participants.length}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          {[10, 25, 50].map((amount) => (
                            <motion.button
                              key={amount}
                              onClick={() => updateProgress(challenge._id, amount)}
                              className="flex-1 bg-[#222] hover:bg-[#333] text-[#f5f5f7] py-2 rounded-lg text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={progress >= 100}
                            >
                              +{amount}%
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "live-updates" && (
            <motion.div
              key="live-updates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-[#A2BFFE]">Live</span> Challenge Updates
              </h2>
              
              {updates.length === 0 ? (
                <div className="text-center py-8 text-[#f5f5f7]/60">
                  <p>No updates yet. Updates will appear here in real-time!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {updates.map((update, index) => (
                    <motion.div
                      key={index}
                      className="bg-[#111] border border-[#222] rounded-lg p-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${update.type === 'join' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <p className="text-sm">{update.message}</p>
                      </div>
                      <p className="text-xs text-[#f5f5f7]/40 mt-2">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Create New Challenge</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={createChallenge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                    Challenge Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 7-Day Meditation"
                    className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the challenge..."
                    className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50 min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-[#222] hover:bg-[#333] text-[#f5f5f7] py-2.5 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] py-2.5 rounded-lg font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Challenge
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenges;