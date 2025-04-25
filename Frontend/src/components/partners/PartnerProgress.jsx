import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const PartnerProgress = ({ partnerId, partnerName, onClose }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerHabits();
  }, [partnerId]);

  const fetchPartnerHabits = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/${partnerId}/progress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHabits(response.data);
    } catch (error) {
      console.error("Failed to fetch partner's habits:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] w-full max-w-lg rounded-xl shadow-xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{partnerName}'s Progress</h3>
          <button
            onClick={onClose}
            className="text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit._id} className="bg-[#1a1a1a] p-4 rounded-lg">
                <h4 className="font-bold">{habit.name}</h4>
                <p className="text-[#f5f5f7]/60 text-sm">{habit.description}</p>
                <div className="mt-2 flex gap-4">
                  <div>
                    <span className="text-sm text-[#f5f5f7]/60">
                      Current Streak:
                    </span>
                    <span className="ml-2 font-bold">
                      {habit.currentStreak} days
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-[#f5f5f7]/60">
                      Best Streak:
                    </span>
                    <span className="ml-2 font-bold">
                      {habit.longestStreak} days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PartnerProgress;
