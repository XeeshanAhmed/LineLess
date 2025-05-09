import { useState, useEffect } from "react";
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
import TokenQueue from "../components/TokenQueue.jsx"; 
import BusinessFeedback from "../components/BusinessFeedback.jsx";
import AnalyticsTab from "../components/AnalyticsTab.jsx"; 


const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const business = JSON.parse(localStorage.getItem("selectedBusiness"));
    const department = localStorage.getItem("selectedDepartment");

    if (business) {
      setSelectedBusiness(business);

      const hasDepartments =
        business.hasDepartments ||
        (business.departments && business.departments.length > 0);

      if (!hasDepartments) {
        localStorage.removeItem("selectedDepartment");
        setSelectedDepartment(null);
      } else {
        setSelectedDepartment(department);
      }
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = async () => {
       
   };


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
      <aside className="w-20 sm:w-64 fixed top-0 left-0 h-full bg-white/10 backdrop-blur-xl shadow-xl p-4 sm:p-6 space-y-4 z-40">
        <h1 className="text-2xl font-bold mb-8 text-white">LineLess</h1>

        {selectedBusiness && (
          <div className="border border-white/20 rounded-2xl bg-white/5 p-4 shadow-md backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white/90">
              {selectedBusiness.name || "Business Name"}
            </h2>
            {selectedDepartment && (
              <p className="text-sm text-white/60 mt-1">{">"} {selectedDepartment}</p>
            )}
          </div>
        )}
        <hr />

        <nav className="space-y-3 mt-6">
          {[
            { tab: "queue", label: "Queue", icon: <FaQrcode /> },
            { tab: "feedback", label: "Feedbacks", icon: <FaChartBar /> },
            { tab: "analytics", label: "Analytics", icon: <FaCommentDots /> },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center sm:w-full justify-center sm:justify-start px-3 py-3 rounded-xl transition-all font-medium shadow-md hover:shadow-lg gap-3 ${
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
      <div className="flex-1 p-6 sm:ml-64 relative">
        {/* Profile Dropdown */}
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
                <button
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center"
                  onClick={() => {
                    setProfileOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  <FaIdBadge className="mr-2" /> Profile Details
                </button>
                <button
                  onClick={handleLogout}
                 className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center text-red-400 hover:text-red-500">
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dialog */}
        <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/20 shadow-2xl w-full max-w-md">
              <Dialog.Title className="text-white text-2xl font-bold mb-4">Profile Details</Dialog.Title>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full p-2 rounded bg-white/20 text-white cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-white/70">Username</label>
                  <input
                    name="username"
                    value={profile.username}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white/20 text-white ${!isEditing ? "cursor-not-allowed" : ""}`}
                  />
                </div>
                <div>
                  <label className="text-white/70">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={profile.password}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white/20 text-white ${!isEditing ? "cursor-not-allowed" : ""}`}
                  />
                </div>
                {showConfirmPassword && (
                  <div>
                    <label className="text-white/70">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={profile.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-white/20 text-white"
                    />
                  </div>
                )}
                {isEditing ? (
                  <button
                    onClick={saveProfile}
                    className="w-full py-2 bg-green-500 hover:bg-green-600 transition rounded text-white font-semibold"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition rounded text-white font-semibold"
                  >
                    Edit
                  </button>
                )}
                {showSavedMessage && (
                  <p className="text-green-400 text-sm text-center mt-2 animate-fadeIn">✅ Changes saved!</p>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Dynamic Content */}
        <div className="mt-20">
           {activeTab === "queue" && (
                <div className="space-y-6 animate-fadeIn">
                  <TokenQueue />
                </div>
              )}

     
          {activeTab === "feedback" && (
           <BusinessFeedback/>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4 animate-fadeIn">
           <AnalyticsTab />
           </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;