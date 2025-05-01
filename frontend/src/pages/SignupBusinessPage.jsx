import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";
import { useNavigate } from "react-router-dom";
import { signupBusiness } from "../services/authBusinessService";

const SignupBusinessPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasDepartments, setHasDepartments] = useState(false);
  const [departments, setDepartments] = useState([""]);
  const [businessName, setBusinessName] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const navigate = useNavigate();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDeptChange = (index, value) => {
    const updated = [...departments];
    updated[index] = value;
    setDepartments(updated);
  };

  const addDepartmentField = () => {
    setDepartments([...departments, ""]);
  };

  const removeDepartmentField = (index) => {
    const updated = [...departments];
    updated.splice(index, 1);
    setDepartments(updated);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
  
    if (!businessName || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const payload = {
        email,
        businessName,
        password,
        hasDepartments
      };
  
      const res = await signupBusiness(payload); 
  
      localStorage.setItem("token", res.token);
      alert("Business account created successfully!");
      setShowOtpModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed.");
      setOtpError("Signup error. Please check inputs.");
    }
    const fakeOtp = "1234"; 
    setGeneratedOtp(fakeOtp);
  };
  
  const handleOtpVerify = async () => {
    if (otp !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      return;
    }
    navigate("/dashboard/business");
    setShowOtpModal(false);
    
  };
  

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* 🌀 Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* ✨ Floating Slogans */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[15%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">
              LineLess
            </div>
            <div className="absolute top-[10%] right-[5%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-2000">
              Say goodbye to waiting lines
            </div>
            <div className="absolute bottom-[20%] left-[15%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-4000">
              Smart Tokening
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-6000">
              No More Queues
            </div>
          </div>

          {/* 🔐 Business Signup Box */}
          <div
            className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10 max-h-[80vh] ${
              hasDepartments
                ? "overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                : ""
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              Business Sign Up
            </h2>
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex items-center space-x-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={hasDepartments}
                  onChange={() => setHasDepartments(!hasDepartments)}
                  className="accent-blue-500"
                />
                <label>Does your business have departments?</label>
              </div>

              {hasDepartments &&
                departments.map((dept, idx) => (
                  <div key={idx} className="relative">
                    <input
                      type="text"
                      placeholder={`Department ${idx + 1}`}
                      value={dept}
                      onChange={(e) => handleDeptChange(idx, e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeDepartmentField(idx)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white hover:scale-110 transition duration-200 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}

              {hasDepartments && (
                <button
                  type="button"
                  onClick={addDepartmentField}
                  className="text-sm text-blue-300 underline"
                >
                  + Add another department
                </button>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-300"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* 📩 OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-[90%] sm:w-[350px] text-white relative">
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Verify Your Email
                </h3>
                <p className="text-sm text-center text-white/80 mb-4 px-2">
                  We've sent a 4-digit OTP to{" "}
                  <span className="font-medium">{email}</span>. Please enter it
                  below to complete your registration.
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="w-full px-4 py-3 text-center text-xl tracking-widest bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                  placeholder="____"
                />
                {otpError && (
                  <p className="text-red-400 text-sm text-center mb-2">
                    {otpError}
                  </p>
                )}
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

export default SignupBusinessPage;
