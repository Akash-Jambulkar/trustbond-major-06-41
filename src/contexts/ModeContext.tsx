
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider = ({ children }: ModeProviderProps) => {
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(false);

  const toggleBlockchain = () => {
    setEnableBlockchain(prev => !prev);
  };

  return (
    <ModeContext.Provider value={{ enableBlockchain, toggleBlockchain }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
