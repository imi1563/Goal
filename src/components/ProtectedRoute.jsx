import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (requiredRole && userRole && !hasRole?.(requiredRole)) {
  //   console.log('Access denied - role check failed:', { requiredRole, userRole });
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoute;
