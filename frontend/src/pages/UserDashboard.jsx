import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaChartBar,
  FaCommentDots,
  FaUserCircle,
  FaSignOutAlt,
  FaIdBadge,
  FaTicketAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const business = JSON.parse(localStorage.getItem("selectedBusiness"));
    const department = localStorage.getItem("selectedDepartment");

    if (business) {
      setSelectedBusiness(business);

      // ✅ Handle businesses with NO departments
      const hasDepartments =
        business.hasDepartments ||
        (business.departments && business.departments.length > 0);

      if (!hasDepartments) {
        // Clear previous department state and storage
        localStorage.removeItem("selectedDepartment");
        setSelectedDepartment(null);
      } else {
        setSelectedDepartment(department);
      }
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="min-h-screen flex bg-black text-white font-sans animate-fadeIn"
      style={{
        animationDuration: "1s",
        animationTimingFunction: "ease-in-out",
      }}
    >
      {/* 🚪 Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-lg shadow-md p-6 space-y-4 hidden sm:block">
        <h1 className="text-2xl font-bold mb-8 text-white">LineLess</h1>

        {/* Business and Department Display */}
        <div className="mb-6">
          {selectedBusiness && (
            <div className="border border-white/20 rounded-2xl bg-white/5 p-4 shadow-md backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white/90">
                {selectedBusiness.name}
              </h2>
              {selectedDepartment && (
                <p className="text-sm text-white/60 mt-1">
                  {">"} {selectedDepartment}
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => handleTabClick("generate")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-all ${
              activeTab === "generate"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FaQrcode className="mr-3" /> Generate Token
          </button>
          <button
            onClick={() => handleTabClick("snapshot")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-all ${
              activeTab === "snapshot"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FaChartBar className="mr-3" /> Live Business Snapshot
          </button>
          <button
            onClick={() => handleTabClick("feedback")}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-all ${
              activeTab === "feedback"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FaCommentDots className="mr-3" /> Feedback & Reviews
          </button>
        </nav>
      </aside>

      {/* 🌟 Main Content */}
      <div className="flex-1 p-6 relative">
        {/* 📛 Profile Dropdown */}
        <div className="absolute top-4 right-6">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition"
            >
              <FaUserCircle size={24} />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 z-50 text-sm">
                <button className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center">
                  <FaTicketAlt className="mr-2" /> Active Tokens
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center">
                  <FaIdBadge className="mr-2" /> Profile Details
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center text-red-400 hover:text-red-500">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🧠 Dynamic Content */}
        <div className="mt-20">
          {activeTab === "generate" && (
            <h2 className="text-2xl font-bold">🎟️ Generate Token Page</h2>
          )}
          {activeTab === "snapshot" && (
            <h2 className="text-2xl font-bold">📊 Live Business Snapshot</h2>
          )}
          {activeTab === "feedback" && (
            <h2 className="text-2xl font-bold">💬 Feedback and Reviews</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
