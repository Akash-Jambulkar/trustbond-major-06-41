
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "You've been logged in to your account.",
        });
        
        const dashboardRoute = `/dashboard/${user?.role || 'user'}`;
        navigate(dashboardRoute);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    isLoading,
    error,
    setShowPassword,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
  };
};
