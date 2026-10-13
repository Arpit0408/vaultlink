// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import LogoutModal from "../components/Logout.jsx";
import Sidebar from "./Sidebar";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoLogOutOutline,
} from "react-icons/io5";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogout, setShowLogout] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 tracking-wide hover:text-blue-700 transition"
            >
              Quick<span className="text-gray-800">Link</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Hi, {user?.user?.name || "User"}
                  </span>
                  <Link
                    to="/dashboard"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setShowLogout(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition"
                  >
                    <IoLogOutOutline size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-3xl text-gray-800 focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
            </button>

            {/* Modal */}
            <LogoutModal
              isOpen={showLogout}
              onClose={() => setShowLogout(false)}
            />
          </div>
        </div>
      </nav>

      {/* Sidebar for Mobile */}
      {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
    </>
  );
};

export default Navbar;
