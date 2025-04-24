import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import HabitForm from "../components/dashboard/HabitForm";
import HabitList from "../components/dashboard/HabitList";
import StreaksList from "../components/dashboard/StreaksList";
import StatsCard from "../components/dashboard/StatsCard";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    currentStreak: 0,
    completionRate: 0,
    totalHabits: 0,
  });
  const [activeTab, setActiveTab] = useState("habits");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabits(response.data);
      calculateStats(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to fetch habits");
      toast.error("Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (habits) => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(
      (habit) => habit.completedToday
    ).length;
    const completionRate = totalHabits
      ? Math.round((completedToday / totalHabits) * 100)
      : 0;
    const highestStreak = Math.max(
      ...habits.map((habit) => habit.currentStreak),
      0
    );

    setStats({
      currentStreak: highestStreak,
      completionRate,
      totalHabits,
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
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7]">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              yo, {user?.username || "User"}! 👋
            </h1>
            <p className="text-[#f5f5f7]/60">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-full font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create New Habit
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="🔥"
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon="📊"
          />
          <StatsCard title="Total Habits" value={stats.totalHabits} icon="✨" />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
            <p className="text-[#f5f5f7]/60 mb-6">
              Create your first habit and begin tracking your progress
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-3 rounded-full font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create First Habit
            </motion.button>
          </motion.div>
        )}

        {/* After Stats Cards */}
        <div className="flex gap-4 mb-6 border-b border-[#222]">
          {["habits", "streaks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 relative ${
                activeTab === tab
                  ? "text-[#A2BFFE]"
                  : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
              }`}
            >
              {tab === "habits" ? "Daily Habits" : "Streak Stats"}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A2BFFE]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Replace the existing HabitList render with this */}
        {!error && habits.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "habits" ? (
                <HabitList habits={habits} onHabitUpdate={fetchHabits} />
              ) : (
                <StreaksList habits={habits} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Create Habit Modal */}
        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSubmit={fetchHabits}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
