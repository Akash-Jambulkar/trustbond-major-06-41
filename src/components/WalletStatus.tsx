
import { useBlockchain } from "@/contexts/BlockchainContext";
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
import { Wallet, AlertTriangle, ExternalLink } from "lucide-react";

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
    switchNetwork 
  } = useBlockchain();

  // Networks to display in the dropdown
  const networks = [
    { name: "Ganache (Local)", id: 1337 },
    { name: "Ethereum Mainnet", id: 1 },
    { name: "Goerli Testnet", id: 5 }
  ];

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
            {networks.map((network) => (
              <DropdownMenuItem 
                key={network.id}
                onClick={() => switchNetwork(network.id)}
                className="cursor-pointer"
              >
                {network.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnectWallet()} className="cursor-pointer text-red-500 focus:text-red-500">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => connectWallet()}
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isBlockchainLoading}
        >
          <Wallet size={20} />
          <span className="hidden md:inline">
            {isBlockchainLoading ? "Connecting..." : "Connect MetaMask"}
          </span>
        </Button>
      )}
    </div>
  );
};
