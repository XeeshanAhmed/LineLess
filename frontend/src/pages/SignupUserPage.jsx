import { useEffect, useState } from "react";
import { signupUser } from "../services/authUserService";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";

const SignupUserPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldError, setFieldError] = useState({});
  const [signupError, setSignupError] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    setFieldError({});
    setSignupError("");

    const errors = {};
    if (!email || !email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!username.trim()) {
      errors.username = "Username is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }

    try {
      const response = await signupUser({
        email,
        password,
        username,
        role: "user"
      });

      console.log(response.message);
      const fakeOtp = "1234";
      setGeneratedOtp(fakeOtp);
      setShowOtpModal(true);
    } catch (error) {
      setSignupError(error.response?.data?.message || "Signup failed.");
    }
  };

  const handleOtpVerify = () => {
    if (otp === generatedOtp) {
      setShowOtpModal(false);
      navigate("/login/user");
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Slogans */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[15%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">LineLess</div>
            <div className="absolute top-[10%] right-[5%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-2000">Say goodbye to waiting lines</div>
            <div className="absolute bottom-[20%] left-[15%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-4000">Smart Tokening</div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-6000">No More Queues</div>
          </div>

          {/* Signup Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">User Sign Up</h2>

            {signupError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-2 text-sm text-center">
                {signupError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.email ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.email && <p className="text-red-500 text-sm mt-1">{fieldError.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.username ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.username && <p className="text-red-500 text-sm mt-1">{fieldError.username}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.password ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.password && <p className="text-red-500 text-sm mt-1">{fieldError.password}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.confirmPassword ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.confirmPassword && <p className="text-red-500 text-sm mt-1">{fieldError.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-300"
              >
                Sign Up
              </button>
            </form>

            {/* Back to Role Selection */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-white/70 hover:text-white transition underline"
              >
                ← Back to Role Selection
              </button>
            </div>
          </div>

          {/* OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-[90%] sm:w-[350px] text-white relative">
                <h3 className="text-xl font-semibold mb-2 text-center">Verify Your Email</h3>
                <p className="text-sm text-center text-white/80 mb-4 px-2">
                  We've sent a 4-digit OTP to <span className="font-medium">{email}</span>. Please enter it below to complete your registration.
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="w-full px-4 py-3 text-center text-xl tracking-widest bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                  placeholder="____"
                />
                {otpError && <p className="text-red-400 text-sm text-center mb-2">{otpError}</p>}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOtpVerify}
                    className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignupUserPage;
