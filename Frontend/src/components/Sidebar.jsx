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
        {/* Home/Dashboard icon */}
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
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
        {/* Chart/Progress icon */}
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
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
        {/* Trophy/Achievement icon */}
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 9H10a1 1 0 110-2h3.586l-2.293-2.293A1 1 0 0112 2z" clipRule="evenodd" />
        <path d="M13 11a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h2v-1a2 2 0 114 0v1h-1zm-2-3a1 1 0 00-1 1v1h2v-1a1 1 0 00-1-1z" />
      </svg>
      ),
    },
    // Add to your navItems array:
{
  path: "/visualizer",
  name: "Visualizer",
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
},
// Add this to your navigation items array
{
  path: "/challenges",
  name: "Challenges",
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  ),
},
// Add to your Sidebar component's navigation links
{
  name: "AI Coach",
  path: "/coach",
  icon: (
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
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
