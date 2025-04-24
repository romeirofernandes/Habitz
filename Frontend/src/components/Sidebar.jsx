import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ children }) => {
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
      <div className="fixed top-0 left-0 h-full w-16 md:w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col py-6 z-10">
        <div className="px-4 mb-8 hidden md:block">
          <Link to="/dashboard" className="text-xl font-bold text-[#A2BFFE]">
            Habitz
          </Link>
        </div>
        
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
                  <span className="hidden md:block">{item.name}</span>
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

        <div className="mt-auto px-2">
          <motion.div className="px-3 py-2 hidden md:block">
            <p className="text-sm font-medium text-[#f5f5f7]">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-[#f5f5f7]/50">{user?.email}</p>
          </motion.div>
          
          <motion.button
            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-[#f5f5f7]/70 hover:text-[#f5f5f7] hover:bg-[#222]/50"
            onClick={logout}
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
            <span className="hidden md:block">Logout</span>
          </motion.button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-16 md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;