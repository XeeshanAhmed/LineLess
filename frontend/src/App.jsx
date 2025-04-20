import { Routes, Route } from "react-router-dom";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignupUserPage from "./pages/SignupUserPage";
import SignupBusinessPage from "./pages/SignupBusinessPage";

function App() {
  return (
    <Routes>
      {/* 🌟 Role selection shown after preloader */}
      <Route path="/" element={<RoleSelectionPage />} />

      {/* 🔐 Login pages for user/business */}
      <Route path="/login/:role" element={<LoginPage />} />

      {/* ✍️ Signup pages */}
      <Route path="/signup/user" element={<SignupUserPage />} />
      <Route path="/signup/business" element={<SignupBusinessPage />} />
    </Routes>
  );
}

export default App;
