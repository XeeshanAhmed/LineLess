import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";
import { useNavigate } from "react-router-dom";
import { signupBusiness } from "../services/authBusinessService";
import { toast } from "react-toastify";
import axios from "axios";

const SignupBusinessPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasDepartments, setHasDepartments] = useState(false);
  const [departments, setDepartments] = useState([""]);

  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpExpired, setOtpExpired] = useState(false);

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
      }, 120000); // 2 minutes
      return () => clearTimeout(timeout);
    }
  }, [otpSentTime]);

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return `${user[0]}***@${domain}`;
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!email || !email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (hasDepartments) {
      const emptyDepts = departments.filter((dept) => !dept.trim());
      const duplicates = departments.filter((item, idx) => departments.indexOf(item) !== idx);
      if (emptyDepts.length > 0) {
        newErrors.departments = "All department fields must be filled.";
      }
      if (duplicates.length > 0) {
        newErrors.departments = "Department names must be unique.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateInputs()) return;

    try {
      // Send OTP first
      const otpRes = await axios.post("http://localhost:5000/api/userAuth/send-otp", { email });
      const otpCode = otpRes.data.otp; // For dev purposes, in production, we don’t expose this

      setGeneratedOtp(otpCode);
      setOtpSentTime(Date.now());
      setOtpExpired(false);
      setResendTimer(30);
      setShowOtpModal(true);
      toast.success("OTP sent to your email. Please verify.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP.";
      toast.error(msg);
    }
  };

  const handleOtpVerify = async () => {
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
      const payload = {
        email,
        businessName,
        password,
        hasDepartments,
        departments: hasDepartments ? departments.filter((d) => d.trim() !== "") : [],
      };

      const res = await signupBusiness(payload);
      localStorage.setItem("token", res.token);
      toast.success("OTP Verified! Business account created.");
      setShowOtpModal(false);
      navigate("/login/business");
    } catch (err) {
      toast.error("Signup failed after OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpRes = await axios.post("/api/userAuth/send-otp", { email });
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

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 ${
      errors[field] ? "ring-red-400" : "focus:ring-blue-400"
    }`;

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

          <div
            className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10 max-h-[80vh] ${
              hasDepartments ? "overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" : ""
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Business Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputClass("businessName")}
                />
                {errors.businessName && <p className="text-red-400 text-sm">{errors.businessName}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass("password")}
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>
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
                      className={`w-full px-4 py-3 pr-10 bg-white/20 text-white rounded-lg outline-none focus:ring-2 ${
                        errors.departments ? "ring-red-400" : "focus:ring-blue-400"
                      }`}
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
              {errors.departments && <p className="text-red-400 text-sm">{errors.departments}</p>}
              {hasDepartments && (
                <button type="button" onClick={addDepartmentField} className="text-sm text-blue-300 underline">
                  + Add another department
                </button>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-300"
              >
                Sign Up
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-white/70 hover:text-white transition underline"
                >
                  ← Back to Role Selection
                </button>
              </div>
            </form>
          </div>

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
                    className={`text-sm text-blue-300 underline disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
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
