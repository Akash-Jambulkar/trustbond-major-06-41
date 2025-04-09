
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, HelpCircle } from "lucide-react";

export const NetworkStatus = () => {
  const { isConnected, networkName, isCorrectNetwork, isGanache } = useBlockchain();
  const { enableBlockchain, isDemoMode } = useMode();

  if (!enableBlockchain) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
        <HelpCircle className="h-3 w-3" />
        <span>Blockchain Disabled</span>
      </Badge>
    );
  }

  if (isDemoMode) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <HelpCircle className="h-3 w-3" />
        <span>Demo Mode</span>
      </Badge>
    );
  }

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        <span>Not Connected</span>
      </Badge>
    );
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
