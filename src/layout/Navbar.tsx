import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative">
          🔔
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            H
          </div>
          <span className="text-gray-700 font-medium">
            Hassan
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
