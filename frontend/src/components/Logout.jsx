import React from "react";
import { logOutUser } from "../apis/userApi"; 

const LogoutModal = ({ isOpen, onClose }) => {
  const handleLogout = async () => {
    try {
      await logOutUser();
      window.location.href = "../auth"; 
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm">
      <div className="bg-black/40 backdrop-blur-md border border-white/30 rounded-xl shadow-lg max-w-sm w-full p-6 text-white">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
