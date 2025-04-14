
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Enable blockchain features by default
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  
  // Load saved blockchain preference
  useEffect(() => {
    const savedBlockchainPref = localStorage.getItem("trustbond_blockchain");
    if (savedBlockchainPref) {
      setEnableBlockchain(savedBlockchainPref === "true");
    } else {
      // Default to enabled
      localStorage.setItem("trustbond_blockchain", "true");
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

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
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
