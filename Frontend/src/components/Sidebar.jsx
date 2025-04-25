import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      path: "/progress",
      name: "Progress",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      path: "/partners",
      name: "Partners",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      path: "/achievements",
      name: "Achievements",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#080808]">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "16rem" }}
        animate={{ width: isCollapsed ? "4rem" : "16rem" }}
        className="fixed top-0 left-0 h-full bg-[#0a0a0a] border-r border-[#222] flex flex-col py-6 z-10"
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="px-4 mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/dashboard" className="text-xl font-bold text-[#A2BFFE]">
              Habitz
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[#222] rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.path}>
                <motion.div
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-2 ${
                    isActive
                      ? "bg-[#A2BFFE]/10 text-[#A2BFFE]"
                      : "text-[#f5f5f7]/70 hover:text-[#f5f5f7] hover:bg-[#222]/50"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 bg-[#A2BFFE] rounded-r-full"
                      layoutId="activeNav"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Profile & Logout */}
        <div className="mt-auto px-2">
          <Link to="/profile">
            <motion.div
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 hover:bg-[#222]/50 transition-colors`}
              whileHover={{ x: 4 }}
            >
              <div className="w-8 h-8 rounded-full bg-[#A2BFFE] flex items-center justify-center">
                <span className="text-sm font-bold text-[#080808]">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f5f5f7] truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-[#f5f5f7]/50 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </motion.div>
          </Link>

          <motion.button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-[#f5f5f7]/70 hover:text-[#f5f5f7] hover:bg-[#222]/50"
            whileHover={{ x: 4 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {!isCollapsed && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ marginLeft: "16rem" }}
        animate={{ marginLeft: isCollapsed ? "4rem" : "16rem" }}
        className="flex-1 transition-all duration-300"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Sidebar;
