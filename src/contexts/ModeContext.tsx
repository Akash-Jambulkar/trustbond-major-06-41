
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type ModeType = "demo" | "production";

interface ModeContextType {
  mode: ModeType;
  toggleMode: () => void;
  isDemoMode: boolean;
  isProductionMode: boolean;
  enableBlockchain: boolean;
  toggleBlockchain: () => void;  // Add the missing toggleBlockchain function
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Default to production mode
  const [mode, setMode] = useState<ModeType>("production");
  // Enable blockchain features in both modes
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  
  // Load saved mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("trustbond_mode");
    if (savedMode === "production" || savedMode === "demo") {
      setMode(savedMode);
    } else {
      // If no saved preference, set to production by default
      localStorage.setItem("trustbond_mode", "production");
    }

    // Load blockchain preference
    const savedBlockchainPref = localStorage.getItem("trustbond_blockchain");
    if (savedBlockchainPref) {
      setEnableBlockchain(savedBlockchainPref === "true");
    } else {
      // Default to enabled
      localStorage.setItem("trustbond_blockchain", "true");
    }
  }, []);

  // Toggle between demo and production modes
  const toggleMode = () => {
    const newMode = mode === "demo" ? "production" : "demo";
    setMode(newMode);
    localStorage.setItem("trustbond_mode", newMode);
    
    toast.success(`Switched to ${newMode} mode`, {
      description: newMode === "demo" 
        ? "Using demo accounts and data" 
        : "Using production environment",
    });
  };

  // Toggle blockchain features
  const toggleBlockchain = () => {
    const newValue = !enableBlockchain;
    setEnableBlockchain(newValue);
    localStorage.setItem("trustbond_blockchain", newValue.toString());
    
    toast.success(`Blockchain features ${newValue ? 'enabled' : 'disabled'}`, {
      description: newValue 
        ? "Smart contract interactions enabled" 
        : "Smart contract interactions disabled",
    });
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        toggleMode,
        isDemoMode: mode === "demo",
        isProductionMode: mode === "production",
        enableBlockchain,
        toggleBlockchain,  // Export the missing toggleBlockchain function
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
