import { useState, useEffect, useCallback } from "react";
import {
  FaUsers,
  FaChartLine,
  FaComments,
  FaUserCircle,
  FaSignOutAlt,
  FaIdBadge,
  FaQrcode,
  FaChartBar,
  FaCommentDots,
} from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import Preloader from "../components/Preloader";
import { useDispatch, useSelector } from "react-redux";
import TokenQueue from "../components/TokenQueue.jsx"; 
import BusinessFeedback from "../components/BusinessFeedback.jsx";
import AnalyticsTab from "../components/AnalyticsTab.jsx"; 
import { logoutBusiness } from "../services/authBusinessService.js";
import { clearBusiness } from "../store/slices/authBusinessSlice.js";
import { resetSelection } from "../store/slices/businessSlice.js";
import { useNavigate } from "react-router-dom";


const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const selectedDepartment = useSelector((state) => state.business.selectedDepartment);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [profile, setProfile] = useState({
    email: "business@example.com",
    username: "lineless_store",
    password: "******",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  //   // const business = JSON.parse(localStorage.getItem("selectedBusiness"));
  //   // const department = localStorage.getItem("selectedDepartment");

  //   if (business) {
  //     setSelectedBusiness(business);

  //     const hasDepartments =
  //       business.hasDepartments ||
  //       (business.departments && business.departments.length > 0);

  //     if (!hasDepartments) {
  //       localStorage.removeItem("selectedDepartment");
  //       setSelectedDepartment(null);
  //     } else {
  //       setSelectedDepartment(department);
  //     }
  //   }

    const timeout = setTimeout(() => {
      setLoading(false);

    }, 500);

    return () => clearTimeout(timeout);
  }, []);

const handleLogout = useCallback(async () => {
    try {
      await logoutBusiness();
      dispatch(clearBusiness());
      dispatch(resetSelection());
      navigate("/login/business");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setShowConfirmPassword(true);
  };

  const saveProfile = () => {
    setShowSavedMessage(true);
    setIsEditing(false);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  if (loading) return <Preloader />;

  return (
  <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white font-sans animate-fadeIn flex">
    {/* Sidebar */}
    <aside className="w-16 sm:w-20 md:w-64 fixed top-0 left-0 h-full bg-white/10 backdrop-blur-xl shadow-xl p-2 sm:p-4 md:p-6 space-y-2 sm:space-y-4 z-40">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-white hidden sm:block">LineLess</h1>

      {selectedBusiness && (
        <div className="border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/5 p-2 sm:p-3 md:p-4 shadow-md backdrop-blur-sm overflow-hidden">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-white/90 truncate">
            {selectedBusiness.businessName}
          </h2>
          {selectedDepartment && (
            <p className="text-xs sm:text-sm text-white/60 mt-1 truncate">
              {">"} {selectedDepartment.departmentName}
            </p>
          )}
        </div>
      )}
      <hr className="my-2 sm:my-4" />

      <nav className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
        {[
          { tab: "queue", label: "Queue", icon: <FaQrcode className="text-sm sm:text-base" /> },
          { tab: "feedback", label: "Feedbacks", icon: <FaChartBar className="text-sm sm:text-base" /> },
          { tab: "analytics", label: "Analytics", icon: <FaCommentDots className="text-sm sm:text-base" /> },
        ].map(({ tab, label, icon }) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex items-center w-full justify-center sm:justify-start px-2 py-2 sm:px-3 sm:py-3 rounded-lg md:rounded-xl transition-all font-medium shadow-md hover:shadow-lg gap-2 sm:gap-3 text-xs sm:text-sm ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-400 to-cyan-400 text-black"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {icon} <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>
    </aside>

    {/* Main Content */}
    <div className="flex-1 p-3 sm:p-4 md:p-6 ml-16 sm:ml-20 md:ml-64 relative">
      {/* Profile Dropdown */}
      <div className="absolute top-2 sm:top-3 md:top-4 right-3 sm:right-4 md:right-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 sm:space-x-2 bg-white/10 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full hover:bg-white/20 transition text-xs sm:text-sm"
          >
            <FaUserCircle size={18} className="sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 sm:mt-2 w-40 sm:w-48 bg-white/10 backdrop-blur-lg rounded-md sm:rounded-lg shadow-lg py-1 sm:py-2 z-50 text-xs sm:text-sm">
              <button
                className="w-full text-left px-3 py-1 sm:px-4 sm:py-2 hover:bg-white/20 flex items-center"
                onClick={() => {
                  setProfileOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <FaIdBadge className="mr-1 sm:mr-2" /> Profile Details
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1 sm:px-4 sm:py-2 hover:bg-white/20 flex items-center text-red-400 hover:text-red-500"
              >
                <FaSignOutAlt className="mr-1 sm:mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 bg-black/30 backdrop-blur-sm">
          <Dialog.Panel className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 border border-white/20 shadow-2xl w-full max-w-xs sm:max-w-md">
            <Dialog.Title className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Profile Details</Dialog.Title>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-white/70 text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-2 text-sm sm:text-base rounded bg-white/20 text-white cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm sm:text-base">Username</label>
                <input
                  name="username"
                  value={profile.username}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className={`w-full p-2 text-sm sm:text-base rounded bg-white/20 text-white ${!isEditing ? "cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className="text-white/70 text-sm sm:text-base">Password</label>
                <input
                  name="password"
                  type="password"
                  value={profile.password}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  className={`w-full p-2 text-sm sm:text-base rounded bg-white/20 text-white ${!isEditing ? "cursor-not-allowed" : ""}`}
                />
              </div>
              {showConfirmPassword && (
                <div>
                  <label className="text-white/70 text-sm sm:text-base">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm sm:text-base rounded bg-white/20 text-white"
                  />
                </div>
              )}
              {isEditing ? (
                <button
                  onClick={saveProfile}
                  className="w-full py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 transition rounded text-white font-semibold"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 transition rounded text-white font-semibold"
                >
                  Edit
                </button>
              )}
              {showSavedMessage && (
                <p className="text-green-400 text-xs sm:text-sm text-center mt-1 sm:mt-2 animate-fadeIn">✅ Changes saved!</p>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Dynamic Content */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        {activeTab === "queue" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <TokenQueue />
          </div>
        )}

        {activeTab === "feedback" && (
          <BusinessFeedback />
        )}

        {activeTab === "analytics" && (
          <div className="space-y-3 sm:space-y-4 animate-fadeIn">
            <AnalyticsTab />
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default BusinessDashboard;