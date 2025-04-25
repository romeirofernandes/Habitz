import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const ParticipantsList = ({ challengeId, challenges }) => {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (challengeId) {
      // Find the selected challenge from the challenges array
      const selectedChallenge = challenges.find(c => c._id === challengeId);
      setChallenge(selectedChallenge);
      
      if (selectedChallenge) {
        // Get participants with user details
        fetchParticipantDetails(selectedChallenge);
      }
    }
  }, [challengeId, challenges]);
  
  const fetchParticipantDetails = async (challenge) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Create an array to hold participants with full details
      const participantsWithDetails = [];
      
      // For each participant in the challenge, get user details
      for (const participant of challenge.participants) {
        const userId = participant.user._id || participant.user;
        
        try {
          const userResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          participantsWithDetails.push({
            ...participant,
            userDetails: userResponse.data,
          });
        } catch (error) {
          // If we can't get user details, still include the participant
          participantsWithDetails.push({
            ...participant,
            userDetails: { username: "Unknown User" }
          });
        }
      }
      
      setParticipants(participantsWithDetails);
    } catch (error) {
      toast.error("Failed to fetch participant details");
    } finally {
      setLoading(false);
    }
  };
  
  if (!challenge) return null;
  
  return (
    <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{challenge.name}: Participants</h2>
        <p className="text-[#f5f5f7]/60 mt-1">
          {participants.length} participants in this challenge
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2BFFE]"></div>
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#f5f5f7]/60">No participants yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Row */}
          <div className="grid grid-cols-12 text-sm text-[#f5f5f7]/60 pb-2 border-b border-[#222]">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Participant</div>
            <div className="col-span-4">Progress</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          
          {/* Participant Rows */}
          {participants
            .sort((a, b) => b.progress - a.progress)
            .map((participant, index) => {
              const username = participant.userDetails?.username || 
                              (typeof participant.user === 'string' 
                                ? `User ${participant.user.substring(0, 5)}...` 
                                : 'Anonymous');
              
              // Get the current user ID to highlight their row
              const token = localStorage.getItem("token");
              const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
              const isCurrentUser = participant.user === currentUserId || 
                                   participant.user?._id === currentUserId;
              
              return (
                <motion.div
                  key={index}
                  className={`grid grid-cols-12 items-center py-3 px-2 rounded-lg ${
                    isCurrentUser ? "bg-[#1a1a1a]" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="col-span-1 font-medium">{index + 1}</div>
                  
                  <div className="col-span-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#A2BFFE] flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-[#080808]">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {username} {isCurrentUser && "(You)"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-4">
                    <div className="w-full bg-[#222] rounded-full h-2.5">
                      <div 
                        className="bg-[#A2BFFE] h-2.5 rounded-full" 
                        style={{ width: `${participant.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs">{participant.progress || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    {participant.completed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                        In Progress
                      </span>
                    )}
                  </div>
                </motion.div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;