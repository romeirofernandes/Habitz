// New component for Google Calendar connection
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";

const GoogleCalendarIntegration = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // Check if user has connected Google Calendar
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setConnected(response.data.googleCalendar?.connected || false);
      } catch (error) {
        console.error("Error checking Google Calendar connection:", error);
      }
    };

    checkConnection();
  }, []);

  // Start connection process
  const connectGoogleCalendar = async () => {
    try {
      setConnecting(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/google-calendar/auth-url`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Open Google auth in a popup window
      const authWindow = window.open(
        response.data.url,
        "Google Calendar Authorization",
        "width=500,height=600"
      );

      // Handle message from popup when auth completes
      window.addEventListener(
        "message",
        async (event) => {
          if (event.data.type === "google-auth-callback" && event.data.code) {
            await submitAuthCode(event.data.code);
          }
        },
        { once: true }
      );
    } catch (error) {
      toast.error("Failed to connect to Google Calendar");
      setConnecting(false);
    }
  };

  // Submit auth code to backend
  const submitAuthCode = async (code) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-calendar/callback`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user object in localStorage with the new Google Calendar connection status
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.googleCalendar = { connected: true };
        localStorage.setItem("user", JSON.stringify(user));
      }

      setConnected(true);
      toast.success("Successfully connected to Google Calendar!");
    } catch (error) {
      toast.error("Failed to complete Google Calendar connection");
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      setConnecting(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/google-calendar/disconnect`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user object in localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.googleCalendar = { connected: false };
        localStorage.setItem("user", JSON.stringify(user));
      }

      setConnected(false);
      toast.success("Disconnected from Google Calendar");
    } catch (error) {
      toast.error("Failed to disconnect from Google Calendar");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4">
      <h3 className="font-bold mb-2">Google Calendar Integration</h3>
      <p className="text-sm text-[#f5f5f7]/60 mb-4">
        Sync your habits with Google Calendar to keep everything organized
      </p>

      {connected ? (
        <div>
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm">Connected to Google Calendar</p>
          </div>

          <motion.button
            onClick={disconnectGoogleCalendar}
            className="text-sm bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-4 py-2 rounded-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={connecting}
          >
            {connecting ? "Disconnecting..." : "Disconnect Calendar"}
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={connectGoogleCalendar}
          className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-2 rounded-md text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={connecting}
        >
          {connecting ? "Connecting..." : "Connect Google Calendar"}
        </motion.button>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
