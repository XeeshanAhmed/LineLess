import { Routes, Route } from "react-router-dom";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignupUserPage from "./pages/SignupUserPage";
import SignupBusinessPage from "./pages/SignupBusinessPage";
import UserDashboard from "./pages/UserDashboard";
import BusinessSelectionPage from "./pages/BusinessSelectionPage";
import BusinessDepartmentSelectionPage from "./pages/BusinessDepartmentSelectionPage";
import UserDepartmentSelectionPage from "./pages/UserDepartmentSelectionPage";
import BusinessDashboard from "./pages/BusinessDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './store/slices/authUserSlice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/userAuth/me', { withCredentials: true });
        dispatch(setUser(res.data.user));
        console.log("res",res);
        console.log("data",res.data);
        console.log("user fetched from token::",res.data.user);
      } catch (err) {
        dispatch(clearUser());
        console.log("no use fetched from token::")
      }
    };

    fetchUser();
  }, []);
  return (
    <>
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/signup/user" element={<SignupUserPage />} />
      <Route path="/signup/business" element={<SignupBusinessPage />} />
      <Route path="/dashboard/user" element={<UserDashboard />} />
      <Route path="/select-business" element={<BusinessSelectionPage />} />
      <Route path="/select-user-department" element={<UserDepartmentSelectionPage />} />
      <Route path="/select-business-department" element={<BusinessDepartmentSelectionPage />} />
      <Route path="/dashboard/business" element={<BusinessDashboard />} />
      <Route path="/forgot-password/:role/:username" element={<ForgotPasswordPage />} />
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
