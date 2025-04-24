import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from "./pages/Landing";
import LoginPage from "./components/Auth/Login"; // Import Login Component
import RegisterPage from "./components/Auth/Register"; // Import Register Component

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
        theme="dark" // Matches your dark theme
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} /> {/* Add Login Route */}
          <Route path="/register" element={<RegisterPage />} /> {/* Add Register Route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;