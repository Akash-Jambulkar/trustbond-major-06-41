
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  isProductionMode: boolean;
  setProductionMode: (value: boolean) => void;
  mode: "production";
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  const [isProductionMode] = useState<boolean>(true); // Always true for production
  
  useEffect(() => {
    const savedBlockchainPref = localStorage.getItem("trustbond_blockchain");
    if (savedBlockchainPref) {
      setEnableBlockchain(savedBlockchainPref === "true");
    } else {
      localStorage.setItem("trustbond_blockchain", "true");
    }
    
    // Always ensure production mode in localStorage
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
  
  // Production mode is always true - helper method kept for backward compatibility
  const setProductionMode = (value: boolean) => {
    if (!value) {
      toast.warning("This application can only run in production mode");
    }
    localStorage.setItem("trustbond_mode", "production");
  };

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
        mode: "production",
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
