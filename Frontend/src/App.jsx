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

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;