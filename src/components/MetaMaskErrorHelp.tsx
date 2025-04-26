
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";

interface MetaMaskErrorHelpProps {
  isOpen: boolean;
  onClose: () => void;
  errorType?: string;
}

export const MetaMaskErrorHelp = ({ isOpen, onClose, errorType = "general" }: MetaMaskErrorHelpProps) => {
  const getErrorContent = () => {
    switch (errorType.toLowerCase()) {
      case "not installed":
        return {
          title: "MetaMask Not Detected",
          description: "You need to install the MetaMask browser extension to connect your wallet.",
          helpLink: "https://metamask.io/download/",
          linkText: "Download MetaMask"
        };
      
      case "rejected":
        return {
          title: "Connection Rejected",
          description: "You rejected the connection request. Please approve the MetaMask connection when prompted.",
          helpLink: "https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask",
          linkText: "MetaMask Help"
        };
        
      case "pending":
        return {
          title: "Connection Request Pending",
          description: "There's already a pending connection request. Please check your MetaMask extension and approve the connection.",
          helpLink: "https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask",
          linkText: "MetaMask Help"
        };
        
      case "wrong network":
        return {
          title: "Incorrect Network",
          description: "You're connected to the wrong network. Please switch to Ethereum Mainnet, Goerli Testnet, or Ganache (for development).",
          helpLink: "https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC",
          linkText: "Add Network to MetaMask"
        };
        
      default:
        return {
          title: "MetaMask Connection Issue",
          description: "There was a problem connecting to MetaMask. Please make sure MetaMask is installed, unlocked, and you have an account set up.",
          helpLink: "https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask",
          linkText: "MetaMask Help"
        };
    }
  };
  
  const content = getErrorContent();
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            {content.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 pt-2">
            {content.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-md my-2 border border-gray-100">
          <h4 className="text-sm font-medium mb-2">Troubleshooting Steps:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Make sure MetaMask is installed in your browser</li>
            <li>• Check that your MetaMask is unlocked</li>
            <li>• Confirm you have an account set up in MetaMask</li>
            <li>• Try refreshing the page and connecting again</li>
          </ul>
        </div>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(content.helpLink, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            {content.linkText}
          </Button>
          <AlertDialogAction>Try Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MetaMaskErrorHelp;
