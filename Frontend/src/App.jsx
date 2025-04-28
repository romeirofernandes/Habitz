import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./components/Auth/Login";
import RegisterPage from "./components/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Progress from "./pages/Progress";
import Sidebar from "./components/Sidebar";
import Partners from "./pages/Partners";
import Achievements from "./pages/Achievements";
import UserProfile from "./components/dashboard/Profile";
import HabitVisualizer from "./pages/HabitVisualizer";
import Challenges from "./pages/Challenges";
import CoachPage from "./pages/CoachPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Dashboard />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Progress />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Partners />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visualizer"
          element={
            <ProtectedRoute>
              <Sidebar>
                <HabitVisualizer />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Achievements />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Sidebar>
                <UserProfile userId={userId} isOwnProfile={true} />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Challenges />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Sidebar>
                <UserProfile isOwnProfile={false} />
              </Sidebar>
            </ProtectedRoute>
          }
        />
        {/* Add coach route */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <Sidebar>
                <CoachPage />
              </Sidebar>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
        toastStyle={{
          background: "#18181b",
          color: "#f5f5f7",
          borderRadius: "12px",
          border: "1px solid #222",
          marginTop: window.innerWidth < 640 ? "1rem" : "0.5rem",
          marginRight: window.innerWidth < 640 ? "0.5rem" : "1.5rem",
          maxWidth: "90vw",
          minWidth: "200px",
        }}
      />
    </BrowserRouter>
  );
}

export default App;
