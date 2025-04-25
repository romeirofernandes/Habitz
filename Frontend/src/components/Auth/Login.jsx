import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Login = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store user data and token
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          username: data.username,
          email: data.email,
        })
      );

      toast.success("Welcome back! 🎉");

      // Redirect to dashboard
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#080808] text-[#f5f5f7] overflow-hidden p-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)]">
          {[...Array(800)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-0.5 rounded-full bg-[#A2BFFE]/20"
            ></div>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-[#0a0a0a]/80 border border-[#A2BFFE]/10 rounded-xl shadow-lg backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-[#A2BFFE]">
          Login to Habitz
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#f5f5f7]/80 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50 focus:border-[#A2BFFE]/50 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#f5f5f7]/80 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50 focus:border-[#A2BFFE]/50 transition"
              placeholder="••••••••"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-3 rounded-md font-bold text-base transition flex justify-center items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#080808]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-[#f5f5f7]/60">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#A2BFFE] hover:text-[#91AFFE] transition"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
