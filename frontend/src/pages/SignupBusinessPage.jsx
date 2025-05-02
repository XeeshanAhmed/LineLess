import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";
import { useNavigate } from "react-router-dom";
import { signupBusiness } from "../services/authBusinessService";

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

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      const payload = {
        email,
        businessName,
        password,
        hasDepartments,
        departments: hasDepartments ? departments.filter(d => d.trim() !== "") : []
      };

      const res = await signupBusiness(payload);
      localStorage.setItem("token", res.token);
      alert("Business account created successfully!");

      const fakeOtp = "1234";
      setGeneratedOtp(fakeOtp);
      setShowOtpModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed.";
      alert(msg);
      setOtpError("Signup error. Please check inputs.");
    }
  };

  const handleOtpVerify = () => {
    if (otp !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      return;
    }
    setShowOtpModal(false);
    navigate("/dashboard/business");
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
          {/* Background Blobs and Floating Text here (same as original) */}

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

          {/* OTP Modal */}
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
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError("");
                  }}
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
