
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous location the user was trying to access (if any)
  const from = location.state?.from || `/dashboard/${user?.role || 'user'}`;

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated && user && !isLoading) {
      console.log("User is already authenticated, redirecting to:", `/dashboard/${user.role}`);
      navigate(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, navigate, isLoading]);
  
  // If still loading, show nothing yet to prevent flashes
  if (isLoading) return null;
  
  // If already authenticated, don't render the login form
  if (isAuthenticated) return null;

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default Login;
