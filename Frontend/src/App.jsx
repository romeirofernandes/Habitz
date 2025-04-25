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
import Achievements from "./pages/Acievements";
import UserProfile from "./components/dashboard/Profile";
import HabitVisualizer from "./pages/HabitVisualizer";
import Challenges from "./pages/Challenges";

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
                <UserProfile
                  userId={userId}
                  isOwnProfile={true}
                />
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
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
