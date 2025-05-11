import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRole }) => {
  const userAuth = useSelector((state) => state.authUser);
  const businessAuth = useSelector((state) => state.authBusiness);

  const isLoading = userAuth.loading || businessAuth.loading;

  const isUserLoggedIn = userAuth.isAuthenticated && userAuth.user?.role === "user";
  const isBusinessLoggedIn = businessAuth.isAuthenticated && businessAuth.business?.role === "business";

  const currentRole = isUserLoggedIn ? "user" : isBusinessLoggedIn ? "business" : null;

  if (isLoading) {
    return <div className="text-center text-white pt-10">Loading...</div>;
  }

  if (!currentRole) {
    return <Navigate to="/"  replace />;
  }
  if (currentRole !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
