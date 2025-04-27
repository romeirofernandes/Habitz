import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const HabitForm = ({ onClose, onSubmit, userGoogleCalendarConnected }) => {
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
    timeOfDay: "",
    description: "",
    reminderSettings: {
      enabled: true,
      reminderTime: 15,
      missedCheckEnabled: true,
    },
    syncWithGoogleCalendar: false,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0a0a0a] rounded-xl p-8 w-full max-w-2xl border border-[#222] my-8"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
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

              <div className="grid grid-cols-2 gap-4">
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

            {/* Right Column - Reminder Settings */}
            <div className="bg-[#111] rounded-lg p-4 border border-[#222]">
              <h3 className="text-lg font-medium mb-4">Reminder Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                  <label className="text-sm font-medium text-[#f5f5f7]/80">
                    Enable Reminders
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.reminderSettings.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminderSettings: {
                          ...formData.reminderSettings,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 accent-[#A2BFFE]"
                  />
                </div>

                {formData.reminderSettings.enabled && (
                  <>
                    <div className="p-3 bg-[#0a0a0a] rounded-lg">
                      <label className="block text-sm font-medium text-[#f5f5f7]/80 mb-2">
                        Reminder Time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={formData.reminderSettings.reminderTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reminderSettings: {
                                ...formData.reminderSettings,
                                reminderTime: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-20 px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                        />
                        <span className="text-sm text-[#f5f5f7]/60">
                          minutes before
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                      <label className="text-sm font-medium text-[#f5f5f7]/80">
                        Enable Missed Habit Check
                      </label>
                      <input
                        type="checkbox"
                        checked={formData.reminderSettings.missedCheckEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderSettings: {
                              ...formData.reminderSettings,
                              missedCheckEnabled: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 accent-[#A2BFFE]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg mt-3">
                      <label className="text-sm font-medium text-[#f5f5f7]/80">
                        Sync with Google Calendar
                      </label>
                      <input
                        type="checkbox"
                        checked={formData.syncWithGoogleCalendar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            syncWithGoogleCalendar: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-[#A2BFFE]"
                        disabled={!userGoogleCalendarConnected}
                      />
                    </div>
                    {!userGoogleCalendarConnected && (
                      <p className="text-xs text-[#f5f5f7]/60 mt-2">
                        Connect Google Calendar in settings to enable this
                        feature
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
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
