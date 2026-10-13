// UpdateProfile.jsx
import React from "react";

const UpdateProfile = ({ onClose }) => {
  return (
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm backdrop-saturate-150 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        {/* Example form fields */}
        <form>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              className="border rounded w-full p-2 mt-1"
              placeholder="Enter new name"
            />
          </label>

          <label className="block mb-4">
            Email:
            <input
              type="email"
              className="border rounded w-full p-2 mt-1"
              placeholder="Enter new email"
            />
          </label>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
