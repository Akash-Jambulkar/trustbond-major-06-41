
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "bank" | "admin" | null;
  allowedRoles?: Array<"user" | "bank" | "admin" | null>;
}

export const ProtectedRoute = ({ children, role, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has one of the allowed roles (if specified)
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Check for single role requirement (legacy support)
  if (role && user?.role !== role) {
    // Redirect to the appropriate dashboard
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // User is authenticated and has the required role (or no role was required)
  return <>{children}</>;
};

// Add default export
export default ProtectedRoute;
