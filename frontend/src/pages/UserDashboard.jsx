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
  import { generateTokenForUser, getLatestTokenNumber } from "../services/tokenService";
  import {getFeedbackForDepartment,submitFeedback as submitFeedbackAPI,} from "../services/feedbackService";  
  import { useSelector, useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { logoutUser } from "../services/authUserService";
  import { resetSelection } from "../store/slices/businessSlice";
  import { clearUser } from "../store/slices/authUserSlice";
  import { FaStar } from "react-icons/fa";
  import { Dialog } from "@headlessui/react";
  import { formatDistanceToNow, parseISO, format } from "date-fns";

  const fetchDemoFeedback = () => {
    const demoFeedback = [
      {
        id: 1,
        user: "Ali Raza",
        rating: 5,
        comment: "Amazing service! Quick and efficient.",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        user: "Sara Ahmed",
        rating: 4,
        comment: "Good experience but can be improved.",
        timestamp: "Yesterday",
      },
      {
        id: 3,
        user: "John Doe",
        rating: 3,
        comment: "Average service, long waiting time.",
        timestamp: "3 days ago",
      },
      {
        id: 4,
        user: "Ayesha Khan",
        rating: 5,
        comment: "Loved how quick and smooth the process was!",
        timestamp: "Just now",
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => resolve(demoFeedback), 500); // simulate API delay
    });
  };

  const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState("generate");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
    const selectedDepartment = useSelector((state) => state.business.selectedDepartment);
    const isAuthenticated = useSelector((state) => state.authUser.isAuthenticated);
    const user = useSelector((state) => state.authUser.user);
    const [loading, setLoading] = useState(true);
    const [latestToken, setLatestToken] = useState(null);
    const [generatedToken, setGeneratedToken] = useState(null);
    const [error, setError] = useState("");
    const [isError, setisError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [feedbackList, setFeedbackList] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [tokensOpen, setTokensOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);


    const [profile, setProfile] = useState({
      email: "hassnainidrees@gmail.com",
      username: "Hassnain",
      password: "123123",
      confirmPassword: "",
    });
  
    const [tokens] = useState([
      { id: 1, business: "Bank of America", token: "A12", time: "10:30 AM" },
      { id: 2, business: "DMV", token: "B45", time: "11:00 AM" },
      { id: 3, business: "ClinicPlus", token: "C03", time: "12:15 PM" },
    ]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
      if (name === "password") setShowConfirmPassword(value !== "");
    };
  
    const saveProfile = () => {
      setIsEditing(false);
      setShowConfirmPassword(false);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    };
  

    useEffect(() => {
      if (activeTab === "feedback") {
        const loadFeedback = async () => {
          try {
            const data = await getFeedbackForDepartment(
              selectedBusiness.businessId,
              selectedDepartment.departmentId
            );
            console.log("feedback api response",data)
            setFeedbackList(data.feedbacks);
          } catch (err) {
            console.error("Error loading feedback:", err);
          }
        };
        loadFeedback();
      }
    }, [activeTab]);
    
    const handleSubmitFeedback = async () => {
      if (!comment.trim() || rating === 0) {
        alert("Please provide a comment and rating!");
        return;
      }
    
      setIsSubmitting(true);
      try {
        const feedbackData = {
          userId:user.id,
          businessId: selectedBusiness.businessId,
          departmentId: selectedDepartment.departmentId,
          rating,
          comment,
        };
    
        const savedFeedback = await submitFeedbackAPI(feedbackData);
    
        setFeedbackList((prev) => [savedFeedback, ...prev]);
        setComment("");
        setRating(0);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback.");
      } finally {
        setIsSubmitting(false);
      }
    
      // const newFeedback = {
      //   id: Date.now(), // Replace with backend ID in real app
      //   user: "You", // Or fetched from auth
      //   comment,
      //   rating,
      //   timestamp: new Date().toLocaleString(),
      // };
    
      // // Simulate API call
      // setTimeout(() => {
      //   setFeedbackList((prev) => [newFeedback, ...prev]);
      //   setComment("");
      //   setRating(0);
      //   setIsSubmitting(false);
      // }, 1000);
    };
    
  ///for the snapshot data
  const [snapshotData, setSnapshotData] = useState(null);

  useEffect(() => {
    if (activeTab === "snapshot") {
      // Simulate snapshot data fetch
      const fakeSnapshot = {
        currentToken: 37,
        nextToken: 38,
        estimatedServiceTime: 12,
        tokensBeforeYou: 5,
      };
      setSnapshotData(fakeSnapshot);
    }
  }, [activeTab]);

  ///
    useEffect(() => {
      const fetchLatestToken = async () => {
        if (!isAuthenticated) {
          navigate('/login/user');
        } else if ((!selectedBusiness || !selectedDepartment) && isAuthenticated) {
          navigate('/select-business');
        }
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
    }, [selectedBusiness, selectedDepartment, isAuthenticated]);

    const handleGenerateToken = async () => {
      try {
        if (!user || !selectedBusiness || !selectedDepartment) return;
        const response = await generateTokenForUser(
          user.id,
          selectedBusiness.businessId,
          selectedDepartment.departmentId
        );
        setGeneratedToken(response.token);
        setisError(false);
        setError("");
      } catch (error) {
        console.error("Token generation failed:", error);
        setError(error.response?.data?.message || "Something went wrong, please try again.");
        setGeneratedToken(error.response?.data?.tokenNumber);
        setisError(true);
      }
    };

    const handleLogout = async () => {
      try {
        await logoutUser();
        dispatch(clearUser());
        dispatch(resetSelection());
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

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
                <button
                  onClick={() => setTokensOpen(true)}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center"
                >
                  <FaTicketAlt className="mr-2" /> Active Tokens
                </button>
                <button
                  onClick={() => setProfileOpen(true)}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center"
                >
                  <FaIdBadge className="mr-2" /> Profile Details
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center text-red-400 hover:text-red-500"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}

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

            {/* Active Tokens Dialog */}
            <Dialog open={tokensOpen} onClose={() => setTokensOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen p-4">
                <Dialog.Panel className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/20 shadow-2xl w-full max-w-xl">
                  <Dialog.Title className="text-white text-2xl font-bold mb-6">Your Active Tokens</Dialog.Title>
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-white/20 text-white p-4 rounded-xl shadow flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">{token.business}</p>
                          <p className="text-sm text-white/70">Token: {token.token}</p>
                        </div>
                        <p className="text-right text-sm">{token.time}</p>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
            
            </div>
          </div>

          {/* Main View */}
                <div className="mt-6 flex justify-center flex-wrap gap-6">
                  {activeTab === "generate" && (
                    <>
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/20 shadow-2xl animate-fadeUp relative -mt-12 z-10">
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
                    onClick={handleGenerateToken}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white text-lg font-semibold py-3 rounded-xl transition-transform hover:scale-105 shadow-xl"
                    >
                    ➕ Generate New Token
                    </button>
                    </div>

                    {generatedToken && !isError && (
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/20 shadow-2xl animate-fadeUp">
                    <h3 className="text-xl font-semibold text-green-400 mb-2">
                      ✅ Token Generated Successfully!
                    </h3>
                    <div className="text-5xl font-bold text-green-300 mb-2 tracking-widest">
                      #{generatedToken.tokenNumber}
                    </div>
                    <p className="text-white/70 mb-1">
                      <strong>Business:</strong> {selectedBusiness?.businessName}
                    </p>
                    <p className="text-white/70 mb-3">
                      <strong>Department:</strong> {selectedDepartment?.departmentName}
                    </p>
                    <p className="text-sm text-white/40 italic">Please wait for your turn. Thank you!</p>
                    </div>
                    )}

                    {error && (
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-red-600/15 border border-red-600/20 rounded-xl shadow-lg text-center animate-fadeIn">
                    <h3 className="text-xl font-semibold text-red-400 mb-2">
                      ❌ Token Generation Failed!
                    </h3>
                    <p className="text-white/70 mb-3">{error}</p>
                    <p className="text-white/70 mb-3 text-xl font-semibold">Your token # {generatedToken}</p>
                    <p className="text-sm text-white/40 italic">Please try again or contact support.</p>
                    </div>
                    )}
                    </>
                  )}


                  {activeTab === "snapshot" && snapshotData && (
                  <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-gray-800 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-cyan-300 mb-6">
                    📊 Live Business Snapshot
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-green-600 text-white text-center">
                    <p className="text-sm">Current Token</p>
                    <p className="text-4xl font-bold">#{snapshotData.currentToken}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-600 text-white text-center">
                    <p className="text-sm">Next Token</p>
                    <p className="text-4xl font-bold">#{snapshotData.nextToken}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-600 text-white text-center">
                    <p className="text-sm">Est. Time</p>
                    <p className="text-3xl font-bold">{snapshotData.estimatedServiceTime} min</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-600 text-white text-center">
                    <p className="text-sm">Tokens Before You</p>
                    <p className="text-4xl font-bold">{snapshotData.tokensBeforeYou}</p>
                    </div>
                    </div>
                    </div>
                  )}

                  {/* {activeTab === "snapshot" && (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {["Registration", "Customer Care", "Billing"].map((dept, index) => (
                    <div
                    key={index}
                    className="p-6 rounded-xl bg-white/10 border border-white/20 shadow-md backdrop-blur-md"
                    >
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">{dept}</h3>
                    <p className="text-white/80">
                      <strong>Now Serving:</strong> #{Math.floor(Math.random() * 90) + 1}
                    </p>
                    <p className="text-white/80">
                      <strong>Tokens Left:</strong> {Math.floor(Math.random() * 30) + 5}
                    </p>
                    <div className="mt-2 text-sm text-white/50 italic">
                      Avg Wait: {Math.floor(Math.random() * 8) + 2} mins
                    </div>
                    </div>
                  ))}
                  </div>
                )} */}

            {/* 💬 Feedback Tab */}
            {activeTab === "feedback" && (
            <div className="w-full max-w-5xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-center text-white">📢 User Feedback</h2>

              {/* 🔥 Write Feedback Section */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-xl font-semibold text-white">Leave Your Feedback</h3>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-2xl cursor-pointer transition-transform duration-200 ${
                        i < rating ? "text-yellow-400 scale-110" : "text-gray-500 hover:text-yellow-300"
                      }`}
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
                </div>

                <textarea
                  className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  rows={4}
                  placeholder="Write your feedback here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>

              {/* 💬 Feedback List Section */}
              {feedbackList.length === 0 ? (
                <div className="text-center text-white/60 animate-pulse">No comments yet...<br/>Be the first to comment out! </div>
              ) : (
                feedbackList.map((fb) => (
                  <div
                    key={fb._id}
                    className="p-6 rounded-xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-white">{fb.userId?.username}</h4>
                      <span className="text-sm text-white/50"> {`${format(parseISO(fb.createdAt), "PPP")} (${formatDistanceToNow(parseISO(fb.createdAt), { addSuffix: true })})`}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-xl ${
                              i < fb.rating ? "text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                    </div>
                    <p className="text-white/80 italic">"{fb.comment}"</p>
                  </div>
                ))
              )}
            </div>
          )}
                
          </div>
        </div>
      </div>
    );
  };

  export default UserDashboard;
