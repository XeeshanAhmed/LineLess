import { useEffect, useState } from "react";
import { signupUser } from "../services/authUserService";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import { toast } from "react-toastify";
import axios from "axios";

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

  const [otpTimeout, setOtpTimeout] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);


  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

   useEffect(() => {
    if (showOtpModal && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpModal, resendTimer]);
  useEffect(() => {
      if (otpSentTime) {
        const timeout = setTimeout(() => {
          setOtpExpired(true);
          toast.error("OTP has expired. Please request a new one.");
        }, 30000); // 2 minutes
        return () => clearTimeout(timeout);
      }
    }, [otpSentTime]);

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return `${user[0]}***@${domain}`;
  };

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
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
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
      

      const otpRes = await axios.post(
        "http://localhost:5000/api/userAuth/send-otp",
        { email }
      );
      const otpCode = otpRes.data.otp; // For development, not for production
      console.log(otpCode);
      setGeneratedOtp(otpCode);
      setOtpSentTime(Date.now());
      setOtpExpired(false);
      setResendTimer(30);
      setShowOtpModal(true);
      toast.success("OTP sent to your email. Please verify.");
    } catch (error) {
      console.log("error ywe h",error)
      const msg = error.response?.data?.message || "Failed to send OTP.";
      setSignupError(msg);
    }
  };

  const handleOtpVerify =async () => {
    if (otpExpired) {
      setOtpError("OTP has expired. Request a new one.");
      toast.error("OTP expired.");
      return;
    }
    if (otp !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      toast.error("Incorrect OTP.");
      return;
    }
    try {
      const response = await signupUser({
        email,
        password,
        username,
        role: "user"
      });
      toast.success("OTP Verified! User account created.");
      setShowOtpModal(false);
      navigate("/login/user");
    } catch (error) {
       toast.error(error.message);
    }
  };

  const handleResendOtp =async () => {
     try {
         const otpRes = await axios.post("http://localhost:5000/api/userAuth/send-otp", { email });
         setGeneratedOtp(otpRes.data.otp);
         setOtp("");
         setOtpExpired(false);
         setOtpSentTime(Date.now());
         setResendTimer(30);
         toast.info("A new OTP has been sent.");
       } catch (err) {
         toast.error("Failed to resend OTP.");
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
                  We've sent a 4-digit OTP to <span className="font-medium">{maskEmail(email)}</span>.
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError("");
                  }}
                  maxLength={4}
                  className="w-full px-4 py-3 text-center text-xl tracking-widest bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                  placeholder="____"
                />
                {otpError && <p className="text-red-400 text-sm text-center mb-2">{otpError}</p>}
                <div className="flex flex-col gap-2 items-center justify-center mt-4">
                  <div className="flex gap-3">
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
                 <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    style={{
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
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
