
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "bank" | "admin" | null;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
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

  // If role is specified, check if user has the required role
  if (role && user?.role !== role) {
    // Redirect to the appropriate dashboard or to login if no role matches
    if (user?.role) {
      return <Navigate to={`/dashboard/${user.role}`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and has the required role (or no role was required)
  return <>{children}</>;
};
