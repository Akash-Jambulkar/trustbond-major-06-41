
export {};

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeListener?: (event: string, callback: any) => void;
    };
  }
}
