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
import { setLoggedInBusiness, clearBusiness } from './store/slices/authBusinessSlice';
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./pages/Unauthorized";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/userAuth/me', { withCredentials: true });
        
        if(res.data.user.role=="user"){
         dispatch(setUser(res.data.user));

        }
      } catch (err) {
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businessAuth/me', {
          withCredentials: true,
        });
        console.log(res);
        
        if(res.data.business){
          
          dispatch(setLoggedInBusiness(res.data.business));

        }
      } catch (err) {
        dispatch(clearBusiness());
      }
    };

    fetchBusiness();
  }, []);
  return (
    <>
    <Routes>
  <Route path="/" element={<RoleSelectionPage />} />
  <Route path="/login/:role" element={<LoginPage />} />
  <Route path="/signup/user" element={<SignupUserPage />} />
  <Route path="/signup/business" element={<SignupBusinessPage />} />

  {/* 🔒 User Routes */}
  <Route path="/dashboard/user" element={
    <PrivateRoute allowedRole="user"><UserDashboard /></PrivateRoute>
  } />
  <Route path="/select-business" element={
    <PrivateRoute allowedRole="user"><BusinessSelectionPage /></PrivateRoute>
  } />
  <Route path="/select-user-department" element={
    <PrivateRoute allowedRole="user"><UserDepartmentSelectionPage /></PrivateRoute>
  } />

  {/* 🔒 Business Routes */}
  <Route path="/dashboard/business" element={
    <PrivateRoute allowedRole="business"><BusinessDashboard /></PrivateRoute>
  } />
  <Route path="/select-business-department" element={
    <PrivateRoute allowedRole="business"><BusinessDepartmentSelectionPage /></PrivateRoute>
  } />

  <Route path="/forgot-password/:role/:username" element={<ForgotPasswordPage />} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  <Route path="*" element={<div>404 - Page Not Found</div>} />
</Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
