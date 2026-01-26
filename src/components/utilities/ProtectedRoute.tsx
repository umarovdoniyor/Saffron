import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // If user is NOT logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user IS logged in, show the page
  return <>{children}</>;
};

export default ProtectedRoute;
