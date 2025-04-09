
import { useState } from "react";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info, ToggleLeft, ToggleRight, AlertTriangle, Wallet } from "lucide-react";

export const ModeToggle = () => {
  const { mode, toggleMode, isDemoMode, isProductionMode, enableBlockchain, toggleBlockchain } = useMode();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {isProductionMode && (
        <Badge variant="destructive" className="mr-1 hidden md:flex">Production</Badge>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-1 ${isProductionMode ? 'border-red-500 text-red-600 hover:bg-red-50' : ''}`}
          >
            {isDemoMode ? (
              <ToggleLeft className="h-5 w-5 text-trustbond-primary" />
            ) : (
              <ToggleRight className="h-5 w-5 text-red-600" />
            )}
            <span className="hidden md:inline">
              {isDemoMode ? "Demo Mode" : "Production Mode"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Label htmlFor="mode-toggle" className="text-sm font-medium">
                  {isDemoMode ? "Demo Mode" : "Production Mode"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isDemoMode 
                    ? "Using demo accounts and sample data" 
                    : "Using production environment and real data"}
                </p>
              </div>
              <Switch 
                id="mode-toggle" 
                checked={!isDemoMode} 
                onCheckedChange={() => {
                  toggleMode();
                  setOpen(false);
                }} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Label htmlFor="blockchain-toggle" className="text-sm font-medium">
                  Blockchain Features
                </Label>
                <p className="text-xs text-muted-foreground">
                  {enableBlockchain 
                    ? "Smart contract interactions enabled" 
                    : "Smart contract interactions disabled"}
                </p>
              </div>
              <Switch 
                id="blockchain-toggle" 
                checked={enableBlockchain} 
                onCheckedChange={() => {
                  toggleBlockchain();
                }} 
              />
            </div>
            
            {isProductionMode && (
              <div className="bg-red-50 p-2 rounded-md flex gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700">
                  <strong>Production Mode Active</strong>
                  <p className="mt-1">
                    You are using real data and production services. All actions will affect real accounts.
                  </p>
                </div>
              </div>
            )}
            
            {isDemoMode && (
              <div className="bg-blue-50 p-2 rounded-md flex gap-2 text-xs">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-blue-700">
                  <strong>Demo Credentials:</strong>
                  <ul className="mt-1 space-y-1">
                    <li><strong>Admin:</strong> admin@trustbond.com / admin123</li>
                    <li><strong>Bank:</strong> bank@trustbond.com / bank123</li>
                    <li><strong>User:</strong> user@trustbond.com / user123</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
