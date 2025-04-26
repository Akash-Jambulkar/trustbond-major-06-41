
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ModeContextType {
  enableBlockchain: boolean;
  toggleBlockchain: () => void;
  setEnableBlockchain: (enabled: boolean) => void;
}

const ModeContext = createContext<ModeContextType>({
  enableBlockchain: false,
  toggleBlockchain: () => {},
  setEnableBlockchain: () => {}
});

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  // Get the initial value from localStorage if available, otherwise false
  const getInitialBlockchainState = (): boolean => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('enableBlockchain');
    return stored ? JSON.parse(stored) : false;
  };

  const [enableBlockchain, setEnableBlockchainState] = useState<boolean>(getInitialBlockchainState);

  // Set the blockchain enabled state and save to localStorage
  const setEnableBlockchain = (enabled: boolean) => {
    setEnableBlockchainState(enabled);
    localStorage.setItem('enableBlockchain', JSON.stringify(enabled));
  };

  // Toggle the blockchain enabled state
  const toggleBlockchain = () => {
    const newState = !enableBlockchain;
    setEnableBlockchain(newState);
  };

  // Sync the state with localStorage on mount
  useEffect(() => {
    const storedValue = localStorage.getItem('enableBlockchain');
    if (storedValue !== null) {
      setEnableBlockchainState(JSON.parse(storedValue));
    }
  }, []);

  return (
    <ModeContext.Provider
      value={{
        enableBlockchain,
        toggleBlockchain,
        setEnableBlockchain
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
