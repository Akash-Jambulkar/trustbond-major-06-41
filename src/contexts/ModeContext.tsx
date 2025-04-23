import { createContext, useContext, useState, ReactNode } from "react";

type ModeContextType = {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ModeContext = createContext<ModeContextType | null>(null);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Always enable blockchain by default
  const [enableBlockchain, setEnableBlockchain] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleBlockchain = () => {
    // Always keep blockchain enabled
    setEnableBlockchain(true);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
