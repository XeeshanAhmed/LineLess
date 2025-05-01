// src/pages/RoleSelectionPage.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Preloader from "../components/Preloader"; // Don't forget this!

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false); // To trigger the "out" effect

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelection = (role) => {
    // Set the page leaving effect before navigating
    setIsLeaving(true);
    setTimeout(() => {
      navigate(`/login/${role}`); // Navigates to the login page with the selected role
    }, 500); // Duration of the out transition
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div
          className={`relative h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${
            isLeaving ? "opacity-0" : "opacity-100"
          }`} // Fade-out effect when leaving
        >
          {/* 🌀 Animated Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* ✨ Floating Slogans */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">
              Ready to Join Us?
            </div>
            <div className="absolute top-[15%] right-[10%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-2000">
              Are you a Business?
            </div>
            <div className="absolute bottom-[20%] left-[15%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-4000">
              Or Are You a User?
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-6000">
              We Make it Easy for You
            </div>
          </div>

          {/* 🔐 Role Selection Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10 text-center">
            <h2 className="text-3xl font-bold mb-6">Select Your Role</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection("user")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
              >
                Login as User
              </button>
              <button
                onClick={() => handleRoleSelection("business")}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-300"
              >
                Login as Business
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionPage;
