import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const HabitForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
    timeOfDay: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/habits`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Habit created successfully! 🎉");
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error(error.response?.data?.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0a0a0a] rounded-xl p-6 w-full max-w-md border border-[#222]"
      >
        <h2 className="text-2xl font-bold mb-4">Create New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Habit Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time of Day
              </label>
              <input
                type="time"
                value={formData.timeOfDay}
                onChange={(e) =>
                  setFormData({ ...formData, timeOfDay: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE] h-24 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              type="submit"
              className="flex-1 bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] py-2 rounded-lg font-bold flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Create Habit"
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#222] hover:border-[#A2BFFE] py-2 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default HabitForm;
