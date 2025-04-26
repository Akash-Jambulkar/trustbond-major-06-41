
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setupUserMFA, verifyUserMFA, disableUserMFA } from '../mfaUtils';
import { User } from '../types';

export const useMFAAuth = (user: User | null, setUser: (user: User | null) => void) => {
  const [isMFARequired, setIsMFARequired] = useState<boolean>(false);
  const navigate = useNavigate();

  const setupMFA = async (phoneNumber: string, method: "sms" | "email") => {
    const success = await setupUserMFA(phoneNumber, method);
    if (success && user) {
      const updatedUser = { ...user, mfa_enabled: true };
      setUser(updatedUser);
    }
    return success;
  };

  const verifyMFA = async (code: string) => {
    const success = await verifyUserMFA(code);
    if (success) {
      setIsMFARequired(false);
      if (user) {
        navigate(`/dashboard/${user.role}`);
      } else {
        navigate("/login");
      }
    }
    return success;
  };

  const disableMFA = async (userId: string) => {
    if (!user) {
      toast.error("No user logged in");
      return false;
    }
    
    const success = await disableUserMFA(user.id);
    if (success) {
      setUser(prevUser => prevUser ? { ...prevUser, mfa_enabled: false } : null);
    }
    return success;
  };

  return {
    isMFARequired,
    setIsMFARequired,
    setupMFA,
    verifyMFA,
    disableMFA
  };
};
