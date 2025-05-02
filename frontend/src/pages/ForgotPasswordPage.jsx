import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";

const ForgotPasswordPage = () => {
  const { role, username } = useParams();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendResetLink = (e) => {
    e.preventDefault();
    // Simulate sending reset email logic
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden transition-all duration-500">
          {/* 🌀 Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* ✨ Floating Text */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">
              LineLess
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-4000">
              No More Queues
            </div>
          </div>

          {/* 🔐 Forgot Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Forgot Password
            </h2>

            {emailSent ? (
              <div className="space-y-4">
                <p className="text-green-400 text-center">
                  Password has been sent to your email: <span className="font-semibold">{username}</span>
                </p>
                <div className="text-center">
                  <button
                    onClick={() => navigate(`/login/${role}`)}
                    className="text-sm text-blue-400 hover:underline mt-4"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <p className="text-sm text-center text-white/70 mb-2">
                  We will send a password to your registered email for{" "}
                  <span className="font-bold">{username}</span>
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
                >
                  Send Password
                </button>

                <div className="text-center">
                  <Link
                    to={`/login/${role}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
