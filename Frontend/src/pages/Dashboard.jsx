import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HabitForest3D from "../components/dashboard/HabitForest3D";
import HabitForm from "../components/dashboard/HabitForm";
import HabitList from "../components/dashboard/HabitList";
import StreaksList from "../components/dashboard/StreaksList";
import StatsCard from "../components/dashboard/StatsCard";
import HabitRecommendations from "../components/dashboard/HabitRecommendation";
import axios from "axios";
import { toast } from "react-toastify";
import QRCodeScanner from "../components/QR/QRCodeScanner";
import { subDays } from "date-fns";

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
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [connectingCalendar, setConnectingCalendar] = useState(false);

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      generateRecommendations();
    }
  }, [habits]);

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
    const highestStreak = Math.max(
      ...habits.map((habit) => habit.currentStreak),
      0
    );

    // Calculate completion rate for the last 7 days (like Progress page)
    const totalOpportunities = totalHabits * 7;
    const completedThisWeek = habits.reduce((total, habit) => {
      const recentCompletions =
        habit.completedDates?.filter(
          (date) => new Date(date) > subDays(new Date(), 7)
        ).length || 0;
      return total + recentCompletions;
    }, 0);

    const completionRate = totalOpportunities
      ? Math.round((completedThisWeek / totalOpportunities) * 100)
      : 0;

    setStats({
      currentStreak: highestStreak,
      completionRate,
      totalHabits,
    });
  };

  const generateRecommendations = async () => {
    // Skip if we don't have habits or already loading
    if (habits.length === 0 || loadingRecommendations) return;

    setLoadingRecommendations(true);

    try {
      // Format the habits data for the API request
      const habitNames = habits.map((h) => h.name);
      const habitCategories = [...new Set(habits.map((h) => h.category))];
      const timePreferences = habits.map((h) => h.timeOfDay);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations`,
        {
          existingHabits: habitNames,
          categories: habitCategories,
          timePreferences: timePreferences,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRecommendations(response.data);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // Set fallback recommendations if the API fails
      setRecommendations([
        {
          category: "health",
          title: "Drink a glass of water",
          recommendation: "Adding water intake could boost your productivity.",
          timeOfDay: "08:00",
          icon: "💧",
        },
        {
          category: "productivity",
          title: "5-minute journal",
          recommendation: "Consider a short journaling session to reflect.",
          timeOfDay: "21:00",
          icon: "📝",
        },
        {
          category: "self-care",
          title: "2-minute meditation",
          recommendation: "Start small with just 2 minutes of meditation.",
          timeOfDay: "07:30",
          icon: "🧘",
        },
      ]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleAddRecommendation = async (habitData) => {
    try {
      const token = localStorage.getItem("token");

      // First check if this exact habit already exists
      const habitExists = habits.some(
        (h) => h.name.toLowerCase() === habitData.name.toLowerCase()
      );

      if (habitExists) {
        toast.info("This habit already exists in your list!");
        return;
      }

      // Create the new habit via API
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        habitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the habits list
      fetchHabits();
      toast.success("Habit added successfully!");
    } catch (error) {
      console.error("Error adding habit:", error);
      toast.error("Failed to add habit");
    }
  };

  const connectGoogleCalendar = async () => {
    try {
      setConnectingCalendar(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/google-calendar/auth-url`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Google auth page
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error starting Google Calendar connection:", error);
      toast.error("Failed to start Google Calendar connection");
      setConnectingCalendar(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("googleCalendarConnected")) {
      // Remove the param from the URL
      window.history.replaceState({}, document.title, window.location.pathname);

      const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err); // Add this instead of ignoring
          toast.error("Failed to update user profile");
        }
      };

      // Sync all eligible habits
      const syncAllHabits = async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/google-calendar/sync-all`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Google Calendar connected and habits synced!");
          fetchHabits(); // Refresh habits list
        } catch (err) {
          toast.error("Failed to sync habits with Google Calendar");
        }
      };

      fetchUser().then(syncAllHabits);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f5f7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2BFFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
              yo, {user?.username || "User"}! 👋
            </h1>
            <p className="text-[#f5f5f7]/60 text-sm sm:text-base">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <motion.button
              onClick={() => setShowQRScanner(true)}
              className="bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              Scan QR
            </motion.button>
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-full font-bold text-sm w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Habit
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon="🔥"
            isStreak={true}
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
        {!error && habits.length > 0 && (
          <>
            <div className="flex gap-2 sm:gap-4 mb-6 border-b border-[#222] overflow-x-auto">
              {["habits", "streaks", "recommendations", "forest"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 relative ${
                    activeTab === tab
                      ? "text-[#A2BFFE]"
                      : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
                  }`}
                >
                  {tab === "habits"
                    ? "Daily Habits"
                    : tab === "streaks"
                    ? "Streak Stats"
                    : tab === "recommendations"
                    ? "For You"
                    : "Habit Forest"}
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
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "habits" ? (
                  <HabitList
                    habits={habits}
                    onHabitUpdate={fetchHabits}
                    user={user}
                  />
                ) : activeTab === "streaks" ? (
                  <StreaksList habits={habits} />
                ) : activeTab === "recommendations" ? (
                  <HabitRecommendations
                    onAddHabit={handleAddRecommendation}
                    recommendations={recommendations}
                    loading={loadingRecommendations}
                    onRefresh={generateRecommendations}
                  />
                ) : (
                  <HabitForest3D habits={habits} />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Create Habit Modal */}
        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSubmit={fetchHabits}
            userGoogleCalendarConnected={Boolean(
              user?.googleCalendar?.connected
            )}
          />
        )}

        {!user?.googleCalendar?.connected && (
          <div className="mb-4">
            <button
              onClick={connectGoogleCalendar}
              disabled={connectingCalendar}
              className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-2 rounded-lg font-semibold flex items-center"
            >
              {connectingCalendar ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#080808] mr-2" />
                  Connecting...
                </>
              ) : (
                <>Connect Google Calendar</>
              )}
            </button>
          </div>
        )}
      </main>
      <AnimatePresence>
        {showQRScanner && (
          <QRCodeScanner
            onClose={() => setShowQRScanner(false)}
            onSuccess={() => fetchHabits()} // Refresh habits after successful scan
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
