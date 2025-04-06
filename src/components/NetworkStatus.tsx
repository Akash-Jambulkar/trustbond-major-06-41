
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check } from "lucide-react";

export const NetworkStatus = () => {
  const { isConnected, networkName, isCorrectNetwork, isGanache } = useBlockchain();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center">
      {isCorrectNetwork ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          <span>{networkName}</span>
          {isGanache && <span className="text-xs">(Testing)</span>}
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Wrong Network: {networkName}</span>
        </Badge>
      )}
    </div>
  );
};
