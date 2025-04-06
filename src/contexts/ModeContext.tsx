
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type ModeType = "demo" | "production";

interface ModeContextType {
  mode: ModeType;
  toggleMode: () => void;
  isDemoMode: boolean;
  isProductionMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Default to production mode instead of demo mode
  const [mode, setMode] = useState<ModeType>("production");
  
  // Load saved mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("trustbond_mode");
    if (savedMode === "production" || savedMode === "demo") {
      setMode(savedMode);
    } else {
      // If no saved preference, set to production by default
      localStorage.setItem("trustbond_mode", "production");
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

  return (
    <ModeContext.Provider
      value={{
        mode,
        toggleMode,
        isDemoMode: mode === "demo",
        isProductionMode: mode === "production",
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
