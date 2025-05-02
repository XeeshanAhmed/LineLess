import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import { loginUser } from "../services/authUserService";
import { loginBusiness } from "../services/authBusinessService";

const LoginPage = () => {
  const { role } = useParams();
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [loginError, setLoginError] = useState("");
  const [showForgotLink, setShowForgotLink] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setFieldError({});
    setLoginError("");
    setShowForgotLink(false);

    const errors = {};
    if (!username.trim()) {
      errors.username =
        role === "business" ? "Business name is required" : "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }

    try {
      const loginData = { email: username, password };
      const res = role === "business" ? await loginBusiness(loginData) : await loginUser(loginData);

      localStorage.setItem("token", res.token);

      if (res.role === "user") {
        navigate("/select-business");
      } else if (res.role === "business") {
        const departments = res.departments || [];
        const isOnlyGeneral = departments.length === 1 && departments[0].toLowerCase() === "general";

        localStorage.setItem("selectedBusiness", JSON.stringify({
          name: res.businessName,
          departments
        }));

        if (isOnlyGeneral) {
          localStorage.setItem("selectedDepartment", "General");
          navigate("/dashboard/business");
        } else {
          navigate("/select-business-department");
        }
      } else {
        setLoginError("Unknown role");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password.";
      setLoginError(message);

      if (message.toLowerCase().includes("password") && username.trim()) {
        setShowForgotLink(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative">
      {showIntro ? (
        <Preloader />
      ) : (
        <div className="relative h-screen flex items-center justify-center overflow-hidden transition-all duration-500">
          {/* Background Blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob"></div>
            <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply blur-2xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Text */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text">LineLess</div>
            <div className="absolute top-[15%] right-[10%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-2000">Say goodbye to waiting lines</div>
            <div className="absolute bottom-[20%] left-[15%] text-4xl font-semibold text-white opacity-10 animate-floating-text animation-delay-4000">Smart Tokening</div>
            <div className="absolute bottom-[10%] right-[10%] text-5xl font-bold text-white opacity-10 animate-floating-text animation-delay-6000">No More Queues</div>
          </div>

          {/* Login Box */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] sm:w-[400px] z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Login as {role}</h2>

            {loginError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-2 text-sm text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "business" ? "Business Email" : "User Email"}
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.username ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.username && <p className="text-red-500 text-sm mt-1">{fieldError.username}</p>}
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full px-4 py-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${fieldError.password ? "border-2 border-red-500" : ""}`}
                />
                {fieldError.password && <p className="text-red-500 text-sm mt-1">{fieldError.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
              >
                Login
              </button>
            </form>

            {/* Forgot Password or Signup */}
            <div className="text-center mt-4">
              {showForgotLink ? (
                <p>
                  Forgot your password?{" "}
                  <Link
                    to={`/forgot-password/${role}/${username}`}
                    className="text-blue-400 hover:underline"
                  >
                    Click here
                  </Link>
                </p>
              ) : (
                <p>
                  Don&apos;t have an account?{" "}
                  <Link
                    to={`/signup/${role}`}
                    className="text-blue-400 hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>
              )}
            </div>

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
        </div>
      )}
    </div>
  );
};

export default LoginPage;
