import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import ReactCanvasConfetti from "react-canvas-confetti";
import HabitEditor from "./HabitEditor"; // Add this import
import { AnimatePresence } from "framer-motion";
import QRCodeGenerator from "../QR/QRCodeGenerator";

const HabitList = ({ habits, onHabitUpdate }) => {
  const [justCompleted, setJustCompleted] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const habitArray = Array.isArray(habits) ? habits : [];
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);

  const confettiRef = useRef(null);

  const makeShot = useCallback((particleRatio, opts) => {
    confettiRef.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const handleCheck = async (habitId) => {
    const habit = habits.find((h) => h._id === habitId);

    // Prevent checking if already completed today
    if (habit.completedToday) {
      toast.info("You've already completed this habit today!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/habits/${habitId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.completedToday) {
        // Trigger confetti and visual feedback
        fire();
        setJustCompleted(habitId);
        setTimeout(() => setJustCompleted(null), 2000);

        // Update parent component state
        onHabitUpdate();
        toast.success("Habit completed! 🎉");
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      if (error.response?.status === 400) {
        // Handle already completed case
        toast.info("This habit was already completed today!");
        // Force refresh to sync with server state
        onHabitUpdate();
      } else {
        toast.error("Failed to update habit");
      }
    }
  };

  // Sort habits to show incomplete ones first and maintain stable order
  const sortedHabits = [...habitArray].sort((a, b) => {
    if (a.completedToday === b.completedToday) {
      // Secondary sort by time of day if both have same completion status
      return a.timeOfDay.localeCompare(b.timeOfDay);
    }
    return a.completedToday ? 1 : -1;
  });

  // Add this function to handle edit button click
  const handleEdit = (habit) => {
    setEditingHabit(habit);
  };

  // Modify the return statement to include the edit button and editor modal
  return (
    <div className="space-y-4">
      {sortedHabits.map((habit) => (
        <motion.div
          key={habit._id}
          className={`bg-[#0a0a0a] border ${
            habit.completedToday ? "border-[#222] opacity-75" : "border-[#222]"
          } rounded-xl p-4 flex items-center justify-between transition-all duration-200`}
          whileHover={{ y: habit.completedToday ? 0 : -2 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => handleCheck(habit._id)}
              disabled={habit.completedToday}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${
                  habit.completedToday
                    ? "bg-[#A2BFFE] border-[#A2BFFE] cursor-not-allowed"
                    : "border-[#444] hover:border-[#A2BFFE] cursor-pointer"
                }`}
              whileHover={habit.completedToday ? {} : { scale: 1.1 }}
              whileTap={habit.completedToday ? {} : { scale: 0.9 }}
            >
              {habit.completedToday && (
                <svg
                  className="w-4 h-4 text-[#080808]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </motion.button>

            <div>
              <h3
                className={`font-bold ${
                  habit.completedToday ? "line-through text-[#f5f5f7]/40" : ""
                }`}
              >
                {habit.name}
              </h3>
              <p
                className={`text-sm ${
                  habit.completedToday
                    ? "text-[#f5f5f7]/40"
                    : "text-[#f5f5f7]/60"
                }`}
              >
                {habit.frequency} •{" "}
                {format(new Date(`2000-01-01T${habit.timeOfDay}`), "h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-[#f5f5f7]/60">
              <span className="font-medium text-[#A2BFFE]">
                {habit.currentStreak}
              </span>{" "}
              day streak
            </div>
            <motion.button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedHabit(habit);
    setShowQRGenerator(true);
  }}
  className="ml-2 p-1 rounded-full hover:bg-[#222] text-[#f5f5f7]/60"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
</motion.button>
            <motion.button
              onClick={() => handleEdit(habit)}
              className="p-2 hover:bg-[#111] rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4 text-[#f5f5f7]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      ))}

      {/* Add the HabitEditor modal */}
      {editingHabit && (
        <HabitEditor
          habit={editingHabit}
          onUpdate={() => {
            onHabitUpdate();
            setEditingHabit(null);
          }}
          onClose={() => setEditingHabit(null)}
        />
      )}

      {/* Existing confetti component */}
      <ReactCanvasConfetti
        ref={confettiRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />

<AnimatePresence>
        {showQRGenerator && selectedHabit && (
          <QRCodeGenerator 
            type="habit" 
            item={selectedHabit} 
            onClose={() => {
              setShowQRGenerator(false);
              setSelectedHabit(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitList;
