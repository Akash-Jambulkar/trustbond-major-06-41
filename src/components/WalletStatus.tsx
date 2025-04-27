import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertTriangle, ExternalLink, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetaMaskErrorHelp } from "./MetaMaskErrorHelp";
import { useAuth } from "@/contexts/AuthContext";
import { updateWalletAddress } from "@/utils/supabase-utils";

export const WalletStatus = () => {
  const { 
    account, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    isBlockchainLoading,
    networkName,
    isCorrectNetwork,
    isGanache,
    switchNetwork,
    connectionError
  } = useBlockchain();
  
  const { enableBlockchain } = useMode();
  const { user, setUser } = useAuth();
  const [showError, setShowError] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [showErrorHelp, setShowErrorHelp] = useState(false);
  const [errorType, setErrorType] = useState("general");

  useEffect(() => {
    if (isConnected) {
      setShowError(false);
      setConnecting(false);
      setShowErrorHelp(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!connectionError) return;
    
    if (connectionError.includes("not detected") || connectionError.includes("install")) {
      setErrorType("not installed");
    } else if (connectionError.includes("rejected")) {
      setErrorType("rejected");
    } else if (connectionError.includes("pending")) {
      setErrorType("pending");
    } else if (connectionError.includes("network")) {
      setErrorType("wrong network");
    } else if (connectionError.includes("JsonRpcEngine") || connectionError.includes("no error or result")) {
      setErrorType("rpc error");
    } else {
      setErrorType("general");
    }
  }, [connectionError]);

  useEffect(() => {
    const syncWalletToProfile = async () => {
      if (isConnected && account && user && (!user.walletAddress || user.walletAddress !== account)) {
        try {
          console.log("Syncing wallet address to profile:", account);
          const { success } = await updateWalletAddress(user.id, account);
          
          if (success) {
            console.log("Wallet address updated in profile");
            setUser({
              ...user,
              walletAddress: account
            });
          } else {
            console.error("Failed to update wallet address in profile");
          }
        } catch (err) {
          console.error("Error updating wallet address:", err);
        }
      }
    };
    
    syncWalletToProfile();
  }, [isConnected, account, user, setUser]);

  if (!enableBlockchain) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button variant="outline" className="flex items-center gap-2" disabled>
                <Wallet size={20} />
                <span className="hidden md:inline">Blockchain Disabled</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Blockchain features are currently disabled. Enable them in settings.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setShowError(false);
      setConnectionAttempts(prev => prev + 1);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await connectWallet();

      if (user && account) {
        await updateWalletAddress(user.id, account);
        
        setUser({
          ...user,
          walletAddress: account
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      setShowError(true);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div>
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 ${!isCorrectNetwork ? 'border-red-500 text-red-600' : ''}`}
            >
              {!isCorrectNetwork && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <Wallet size={20} />
              <span className="hidden md:inline">
                {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
              </span>
              {isGanache && <Badge variant="outline" className="ml-2 hidden md:flex">Ganache</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="mb-2">
                <p className="text-sm font-medium">Account:</p>
                <p className="text-xs text-muted-foreground break-all">{account}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium">Network:</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs">{networkName}</p>
                  {!isCorrectNetwork && (
                    <Badge variant="destructive" className="text-xs">Wrong Network</Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            {["Ganache (Local)", "Ethereum Mainnet", "Goerli Testnet", "Sepolia Testnet"].map((network, idx) => (
              <DropdownMenuItem 
                key={network}
                onClick={() => switchNetwork([1337, 1, 5, 11155111][idx])}
                className="cursor-pointer"
              >
                {network}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnectWallet()} className="cursor-pointer text-red-500 focus:text-red-500">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-col">
          <div className="flex gap-2">
            <Button 
              onClick={handleConnect}
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isBlockchainLoading || connecting}
            >
              <Wallet size={20} />
              <span className="hidden md:inline">
                {connecting || isBlockchainLoading ? "Connecting..." : "Connect MetaMask"}
              </span>
            </Button>
            
            {showError && connectionError && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowErrorHelp(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <AlertCircle size={20} />
              </Button>
            )}
          </div>
          
          {showError && connectionError && (
            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{connectionError}</span>
            </div>
          )}
        </div>
      )}
      
      <MetaMaskErrorHelp 
        isOpen={showErrorHelp}
        onClose={() => setShowErrorHelp(false)}
        errorType={errorType}
      />
    </div>
  );
};
