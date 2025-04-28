import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  format,
  startOfWeek,
  eachDayOfInterval,
  addDays,
  subDays,
  isToday,
} from "date-fns";
import { toast } from "react-toastify";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Achievements from "./Achievements";
import ShareProgress from "../components/Progress/ShareProgress";
import ContributionGraph from "../components/Progress/ContributionGraph";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Progress = () => {
  const [habits, setHabits] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({
    longestStreak: 0,
    totalCompleted: 0,
    completionRate: 0,
    mostProductiveDay: "Monday",
    mostProductiveTime: "Morning",
  });

  const [viewMode, setViewMode] = useState("week"); // 'week', 'month', 'year'

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      prepareWeeklyData();
      calculateInsights(); // Optionally recalculate insights too
    }
  }, [viewMode, habits]);

  useEffect(() => {
    if (habits.length > 0) {
      calculateInsights();
      prepareWeeklyData();
    }
  }, [habits]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
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
      setError(null);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to fetch habits data");
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const calculateInsights = () => {
    // Find longest streak
    const longestStreak = Math.max(
      ...habits.map((habit) => habit.longestStreak || 0),
      0
    );

    // Calculate total completed for all time
    const totalCompleted = habits.reduce(
      (total, habit) => total + (habit.completedDates?.length || 0),
      0
    );

    // Calculate completion rate (completed / opportunities to complete)
    const totalOpportunities = habits.length * 7; // Simple approximation for the last week
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

    // Basic time-of-day analysis based on habit.timeOfDay
    const timeOfDayMap = habits.reduce(
      (acc, habit) => {
        if (habit.timeOfDay) {
          const hour = parseInt(habit.timeOfDay.split(":")[0]);
          if (hour < 12) acc.morning++;
          else if (hour < 18) acc.afternoon++;
          else acc.evening++;
        }
        return acc;
      },
      { morning: 0, afternoon: 0, evening: 0 }
    );

    const mostProductiveTime = Object.keys(timeOfDayMap).reduce(
      (a, b) => (timeOfDayMap[a] > timeOfDayMap[b] ? a : b),
      "morning"
    );

    // Determine most productive day (this requires more data than we might have, so it's a placeholder)
    const mostProductiveDay = "Monday"; // Would normally calculate this from completedDates

    setInsights({
      longestStreak,
      totalCompleted,
      completionRate,
      mostProductiveDay,
      mostProductiveTime:
        mostProductiveTime.charAt(0).toUpperCase() +
        mostProductiveTime.slice(1),
    });
  };

  const prepareWeeklyData = () => {
    const today = new Date();
    let startDay, endDay, days;

    // Define date ranges based on viewMode
    switch (viewMode) {
      case "month":
        // Get data for the last 30 days
        startDay = subDays(today, 29); // 30 days including today
        endDay = today;
        break;
      case "all":
        // Show all data (limit to last 90 days or customize as needed)
        startDay = subDays(today, 89); // 90 days including today
        endDay = today;
        break;
      case "week":
      default:
        // Current implementation - last 7 days
        startDay = startOfWeek(today);
        endDay = addDays(startDay, 6);
        break;
    }

    // Generate array of days in the selected range
    days = eachDayOfInterval({ start: startDay, end: endDay });

    // Rest of your data preparation logic remains the same
    const data = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");

      // Count completed habits for this day
      const completed = habits.reduce((count, habit) => {
        const wasCompletedOnDay = habit.completedDates?.some((date) => {
          const completedDate = new Date(date);
          return format(completedDate, "yyyy-MM-dd") === dateStr;
        });
        return wasCompletedOnDay ? count + 1 : count;
      }, 0);

      // Total habits that existed on this day (simplified)
      const total = habits.length;

      return {
        date: dateStr,
        day: format(day, viewMode === "week" ? "EEE" : "MMM dd"), // Different format for month/all
        completed,
        missed: total - completed,
        percentage: total ? Math.round((completed / total) * 100) : 0,
        isToday: isToday(day),
      };
    });

    setWeeklyData(data);
  };

  const barChartData = {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        label: "Completed",
        data: weeklyData.map((d) => d.completed),
        backgroundColor: "rgba(162, 191, 254, 0.8)",
        borderColor: "#A2BFFE",
        borderWidth: 1,
      },
      {
        label: "Missed",
        data: weeklyData.map((d) => d.missed),
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255, 99, 132, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        label: "Completion Rate (%)",
        data: weeklyData.map((d) => d.percentage),
        backgroundColor: "rgba(162, 191, 254, 0.2)",
        borderColor: "#A2BFFE",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(245, 245, 247, 0.8)",
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0a0a0a",
        titleColor: "#f5f5f7",
        bodyColor: "#f5f5f7",
        titleFont: {
          family: "Bricolage Grotesque, sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: "#A2BFFE",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(245, 245, 247, 0.6)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(245, 245, 247, 0.6)",
        },
      },
    },
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
            <p className="text-[#f5f5f7]/60">
              Track your habit consistency and identify patterns
            </p>
          </div>

          <div className="flex gap-2 bg-[#0a0a0a] border border-[#222] rounded-full">
            {["week", "month", "all"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  viewMode === mode
                    ? "bg-[#A2BFFE] text-[#080808]"
                    : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Insights Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-medium text-[#f5f5f7]/60 mb-1 text-sm">
              Longest Streak
            </h3>
            <p className="text-2xl font-bold">{insights.longestStreak} days</p>
          </motion.div>

          <motion.div
            className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-medium text-[#f5f5f7]/60 mb-1 text-sm">
              Completion Rate
            </h3>
            <p className="text-2xl font-bold">{insights.completionRate}%</p>
          </motion.div>

          <motion.div
            className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-medium text-[#f5f5f7]/60 mb-1 text-sm">
              Most Productive Time
            </h3>
            <p className="text-2xl font-bold">{insights.mostProductiveTime}</p>
          </motion.div>

          <motion.div
            className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-medium text-[#f5f5f7]/60 mb-1 text-sm">
              Total Completions
            </h3>
            <p className="text-2xl font-bold">{insights.totalCompleted}</p>
          </motion.div>
        </div>

        {/* Add this after the insights cards and before Weekly Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
          <ContributionGraph habits={habits} />
        </div>

        {/* Weekly Summary */}
        <h2 className="text-xl font-bold mb-4">Weekly Summary</h2>
        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-6">
            <div className="w-full md:w-1/2">
              <h3 className="font-medium text-[#A2BFFE] mb-4">
                Daily Completion
              </h3>
              <div className="h-[250px]">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-medium text-[#A2BFFE] mb-4">
                Completion Rate
              </h3>
              <div className="h-[250px]">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div
            className={`grid ${
              viewMode === "week"
                ? "grid-cols-3 sm:grid-cols-7"
                : "grid-cols-3 sm:grid-cols-10 overflow-x-auto"
            } gap-2`}
          >
            {weeklyData.map((day, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center ${
                  day.isToday
                    ? "border border-[#A2BFFE]/50"
                    : "border border-[#222]"
                }`}
              >
                <p className="text-sm font-medium text-[#f5f5f7]/80">
                  {day.day}
                </p>
                <div className="my-2 font-bold text-lg">{day.percentage}%</div>
                <p className="text-xs text-[#f5f5f7]/60">
                  {day.completed}/{day.completed + day.missed} habits
                </p>
              </div>
            ))}
          </div>
        </div>

        <ShareProgress stats={insights} />
        {/* Habits Performance */}
        <h2 className="text-xl font-bold mb-4">Individual Habit Performance</h2>
        <div className="space-y-4 mb-8">
          {habits.map((habit) => (
            <motion.div
              key={habit._id}
              className="bg-[#0a0a0a] border border-[#222] rounded-xl p-3 sm:p-4"
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div className="w-full sm:w-auto">
                  <h3 className="font-bold text-base sm:text-lg">
                    {habit.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-1">
                    <span className="text-sm text-[#f5f5f7]/60">
                      Current streak:
                      <span className="text-[#A2BFFE] ml-1">
                        {habit.currentStreak} days
                      </span>
                    </span>
                    <span className="text-sm text-[#f5f5f7]/60">
                      <span className="hidden sm:inline">| </span>Best:
                      <span className="text-[#A2BFFE] ml-1">
                        {habit.longestStreak} days
                      </span>
                    </span>
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-xl sm:text-2xl font-bold">
                    {habit.completedDates?.length || 0}
                  </div>
                  <p className="text-xs text-[#f5f5f7]/60">total completions</p>
                </div>
              </div>

              {/* Small 7-day streak visualization */}
              <div className="flex gap-1 mt-3">
                {Array(7)
                  .fill(0)
                  .map((_, idx) => {
                    // Check if habit was completed each of the last 7 days
                    const date = subDays(new Date(), 6 - idx);
                    const dateStr = format(date, "yyyy-MM-dd");

                    const wasCompleted = habit.completedDates?.some(
                      (completedDate) => {
                        return (
                          format(new Date(completedDate), "yyyy-MM-dd") ===
                          dateStr
                        );
                      }
                    );

                    return (
                      <div
                        key={idx}
                        className={`flex-1 h-2 rounded-full ${
                          wasCompleted ? "bg-[#A2BFFE]" : "bg-[#222]"
                        }`}
                      ></div>
                    );
                  })}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Progress;
