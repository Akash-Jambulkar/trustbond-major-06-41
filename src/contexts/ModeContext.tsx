
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  isDemoMode: boolean;
  isProductionMode: boolean;
  mode: "production";
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  
  useEffect(() => {
    const savedBlockchainPref = localStorage.getItem("trustbond_blockchain");
    if (savedBlockchainPref) {
      setEnableBlockchain(savedBlockchainPref === "true");
    } else {
      localStorage.setItem("trustbond_blockchain", "true");
    }
    
    // Always set to production mode
    localStorage.setItem("trustbond_mode", "production");
  }, []);

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
  
  // Hard-coded production mode values
  const isDemoMode = false;
  const isProductionMode = true;
  const mode = "production" as const;
  
  const toggleMode = () => {
    // No-op, we're always in production mode
    toast.info("The application is running in production mode");
  };

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
