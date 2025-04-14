
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  // Add these missing properties
  isDemoMode: boolean;
  isProductionMode: boolean;
  mode: "production" | "demo";
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Enable blockchain features by default
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  // Add mode state
  const [mode, setMode] = useState<"production" | "demo">("production");
  
  // Load saved blockchain preference
  useEffect(() => {
    const savedBlockchainPref = localStorage.getItem("trustbond_blockchain");
    if (savedBlockchainPref) {
      setEnableBlockchain(savedBlockchainPref === "true");
    } else {
      // Default to enabled
      localStorage.setItem("trustbond_blockchain", "true");
    }
    
    // Load saved mode preference
    const savedMode = localStorage.getItem("trustbond_mode");
    if (savedMode && (savedMode === "production" || savedMode === "demo")) {
      setMode(savedMode as "production" | "demo");
    } else {
      // Default to production
      localStorage.setItem("trustbond_mode", "production");
    }
  }, []);

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
  
  // Toggle mode between production and demo
  const toggleMode = () => {
    const newMode = mode === "production" ? "demo" : "production";
    setMode(newMode);
    localStorage.setItem("trustbond_mode", newMode);
    
    toast.success(`Switched to ${newMode} mode`, {
      description: newMode === "production" 
        ? "Using production data and features" 
        : "Using demo data and features",
    });
  };
  
  // Computed properties
  const isDemoMode = mode === "demo";
  const isProductionMode = mode === "production";

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
        mode,
        toggleMode,
        isDemoMode,
        isProductionMode
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
