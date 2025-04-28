import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ConfirmationModal from "../ConfirmationModal";

const HabitEditor = ({
  habit,
  onUpdate,
  onClose,
  userGoogleCalendarConnected = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedHabit, setEditedHabit] = useState({
    name: habit.name,
    description: habit.description || "",
    frequency: habit.frequency,
    timeOfDay: habit.timeOfDay,
    reminderSettings: {
      enabled: habit.reminderSettings?.enabled ?? true,
      reminderTime: habit.reminderSettings?.reminderTime ?? 15,
      missedCheckEnabled: habit.reminderSettings?.missedCheckEnabled ?? true,
    },
    syncWithGoogleCalendar: habit.syncWithGoogleCalendar || false,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        editedHabit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Habit updated successfully! 🎉");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating habit:", error);
      toast.error(error.response?.data?.message || "Failed to update habit");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Habit deleted successfully");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Habit</h2>
          <button
            onClick={onClose}
            className="text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={editedHabit.name}
                  onChange={(e) =>
                    setEditedHabit({ ...editedHabit, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editedHabit.description}
                  onChange={(e) =>
                    setEditedHabit({
                      ...editedHabit,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE] h-24 resize-none"
                />
              </div>
            </div>

            {/* Right Column - Schedule & Reminders */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Frequency
                  </label>
                  <select
                    value={editedHabit.frequency}
                    onChange={(e) =>
                      setEditedHabit({
                        ...editedHabit,
                        frequency: e.target.value,
                      })
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
                    value={editedHabit.timeOfDay}
                    onChange={(e) =>
                      setEditedHabit({
                        ...editedHabit,
                        timeOfDay: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#111] rounded-lg p-4 border border-[#222] space-y-4">
                <h3 className="font-medium">Reminder Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                    <label className="text-sm font-medium text-[#f5f5f7]/80">
                      Enable Reminders
                    </label>
                    <input
                      type="checkbox"
                      checked={editedHabit.reminderSettings.enabled}
                      onChange={(e) =>
                        setEditedHabit({
                          ...editedHabit,
                          reminderSettings: {
                            ...editedHabit.reminderSettings,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 accent-[#A2BFFE]"
                    />
                  </div>

                  {editedHabit.reminderSettings.enabled && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#0a0a0a] rounded-lg">
                        <label className="block text-sm font-medium mb-2">
                          Reminder Time (minutes before)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={editedHabit.reminderSettings.reminderTime}
                          onChange={(e) =>
                            setEditedHabit({
                              ...editedHabit,
                              reminderSettings: {
                                ...editedHabit.reminderSettings,
                                reminderTime: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#A2BFFE]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                        <label className="text-sm font-medium text-[#f5f5f7]/80">
                          Enable Missed Habit Check
                        </label>
                        <input
                          type="checkbox"
                          checked={
                            editedHabit.reminderSettings.missedCheckEnabled
                          }
                          onChange={(e) =>
                            setEditedHabit({
                              ...editedHabit,
                              reminderSettings: {
                                ...editedHabit.reminderSettings,
                                missedCheckEnabled: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 accent-[#A2BFFE]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                        <label className="text-sm font-medium text-[#f5f5f7]/80">
                          Sync with Google Calendar
                        </label>
                        <input
                          type="checkbox"
                          checked={editedHabit.syncWithGoogleCalendar}
                          onChange={(e) =>
                            setEditedHabit({
                              ...editedHabit,
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
                    </div>
                  )}
                </div>
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
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#080808]" />
              ) : (
                "Save Changes"
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 py-2 rounded-lg font-bold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              Delete Habit
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

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default HabitEditor;
