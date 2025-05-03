import { useState, useEffect } from "react";
import {
  FaQrcode,
  FaChartBar,
  FaCommentDots,
  FaUserCircle,
  FaSignOutAlt,
  FaIdBadge,
  FaTicketAlt,
} from "react-icons/fa";
import Preloader from "../components/Preloader";
import { getLatestTokenNumber } from "../services/tokenService";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const selectedDepartment = useSelector((state) => state.business.selectedDepartment);
  const [loading, setLoading] = useState(true);
  const [latestToken, setLatestToken] = useState(null);

  useEffect(() => {
    const fetchLatestToken = async () => {
      if (!selectedBusiness || !selectedDepartment) return;
      setLoading(true);
      try {
        const token = await getLatestTokenNumber(
          selectedBusiness.businessId,
          selectedDepartment.departmentId
        );
        setLatestToken(token);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch latest token:", error);
        setLatestToken("Error");
        setLoading(false);
      }
    };

    fetchLatestToken();
  }, [selectedBusiness, selectedDepartment]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white font-sans animate-fadeIn">
      {/* Sidebar */}
      <aside className="w-20 sm:w-64 fixed top-0 left-0 h-full bg-white/10 backdrop-blur-xl shadow-xl p-4 sm:p-6 space-y-4 z-40">
        <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wide hidden sm:block">LineLess</h1>

        {selectedBusiness && (
          <div className="hidden sm:block border border-white/20 rounded-2xl bg-white/5 p-4 shadow-lg backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white/90">
              {selectedBusiness.businessName}
            </h2>
            {selectedDepartment && (
              <p className="text-sm text-white/60 mt-1">
                {">"} {selectedDepartment.departmentName}
              </p>
            )}
          </div>
        )}

        <nav className="space-y-3 mt-6">
          {[
            { tab: "generate", label: "Generate", icon: <FaQrcode /> },
            { tab: "snapshot", label: "Snapshot", icon: <FaChartBar /> },
            { tab: "feedback", label: "Feedback", icon: <FaCommentDots /> },
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
      <div className="ml-0 sm:ml-64 p-6">
        {/* Profile Dropdown */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition shadow-md"
            >
              <FaUserCircle size={22} />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg py-2 text-sm z-50">
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

        {/* Main View */}
        <div className="mt-8 flex justify-center">
          {activeTab === "generate" && (
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/20 shadow-2xl animate-fadeUp">
              <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
                🎟️ Generate Token
              </h2>

              <div className="bg-black/30 rounded-xl p-10 mb-8 text-center shadow-inner border border-white/10">
                <p className="text-sm text-white/60 uppercase mb-2 tracking-widest">Token Number</p>
                <p className="text-6xl font-bold text-emerald-400 animate-pulse">
                  {latestToken !== null ? `#${latestToken}` : "----"}
                </p>
              </div>

              <div className="flex justify-between text-white/80 text-sm mb-6">
                <div>
                  <p className="text-xs font-semibold">Business</p>
                  <p>{selectedBusiness?.businessName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">Department</p>
                  <p>{selectedDepartment?.departmentName || "N/A"}</p>
                </div>
              </div>

              <button
                // onClick={handleGenerateToken}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white text-lg font-semibold py-3 rounded-xl transition-transform hover:scale-105 shadow-xl"
              >
                ➕ Generate New Token
              </button>
            </div>
          )}

          {activeTab === "snapshot" && (
            <h2 className="text-2xl font-bold text-center">📊 Live Business Snapshot</h2>
          )}

          {activeTab === "feedback" && (
            <h2 className="text-2xl font-bold text-center">💬 Feedback and Reviews</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
