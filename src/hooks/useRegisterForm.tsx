
import { useState, useEffect } from "react";
import { useMode } from "@/contexts/ModeContext";
import { UserRole } from "@/contexts/auth/types";

export const useRegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const { isProductionMode } = useMode();
  
  // Clear form data when switching between production and demo modes
  useEffect(() => {
    if (isProductionMode) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isProductionMode]);

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole
  };
};
