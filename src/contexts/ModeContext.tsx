
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  isDemoMode: boolean;
  isProductionMode: boolean;
  setProductionMode: (value: boolean) => void; // Added setProductionMode method
  mode: "production";
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  const [isProductionMode, setIsProductionMode] = useState<boolean>(true); // Use state variable instead of hard-coded value
  
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
  
  // Production mode handling
  const isDemoMode = !isProductionMode;
  const mode = "production" as const;
  
  const setProductionMode = (value: boolean) => {
    setIsProductionMode(value);
    localStorage.setItem("trustbond_mode", value ? "production" : "demo");
  };
  
  const toggleMode = () => {
    const newValue = !isProductionMode;
    setIsProductionMode(newValue);
    localStorage.setItem("trustbond_mode", newValue ? "production" : "demo");
    
    toast.info(`The application is now running in ${newValue ? 'production' : 'demo'} mode`);
  };

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
        mode,
        toggleMode,
        isDemoMode,
        isProductionMode,
        setProductionMode
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
