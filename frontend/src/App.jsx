import { Routes, Route } from "react-router-dom";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignupUserPage from "./pages/SignupUserPage";
import SignupBusinessPage from "./pages/SignupBusinessPage";
import UserDashboard from "./pages/UserDashboard";
import BusinessSelectionPage from "./pages/BusinessSelectionPage";
import DepartmentSelectionPage from "./pages/DepartmentSelectionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/signup/user" element={<SignupUserPage />} />
      <Route path="/signup/business" element={<SignupBusinessPage />} />
      <Route path="/dashboard/user" element={<UserDashboard />} />
      <Route path="/select-business" element={<BusinessSelectionPage />} />
      <Route path="/select-department" element={<DepartmentSelectionPage />} />
    </Routes>
  );
}

export default App;
