import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";
import { useParams, Link } from "react-router-dom";

const LoginPage = () => {
  const { role } = useParams();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* 🌀 Animated Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* ✨ Floating Slogans - Balanced layout */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">
              LineLess
            </div>
            <div className="absolute top-[15%] right-[10%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-2000">
              Say goodbye to waiting lines
            </div>
            <div className="absolute bottom-[20%] left-[15%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-4000">
              Smart Tokening
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-6000">
              No More Queues
            </div>
          </div>

          {/* 🔐 Login Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Login as {role}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
              >
                Login
              </button>
            </form>

            {/* ✅ Updated dynamic signup link */}
            <div className="text-center mt-4">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  to={`/signup/${role}`}
                  className="text-blue-400 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
