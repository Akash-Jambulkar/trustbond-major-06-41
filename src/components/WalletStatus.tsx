
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const WalletStatus = () => {
  const { account, isConnected, connectWallet, disconnectWallet, isBlockchainLoading } = useBlockchain();

  return (
    <div>
      {isConnected ? (
        <Button 
          onClick={() => disconnectWallet()}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Wallet size={20} />
          <span className="hidden md:inline">
            {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
          </span>
        </Button>
      ) : (
        <Button 
          onClick={() => connectWallet()}
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isBlockchainLoading}
        >
          <Wallet size={20} />
          <span className="hidden md:inline">
            {isBlockchainLoading ? "Connecting..." : "Connect Wallet"}
          </span>
        </Button>
      )}
    </div>
  );
};
