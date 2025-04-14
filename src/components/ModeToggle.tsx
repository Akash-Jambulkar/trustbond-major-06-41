
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
import { Wallet } from "lucide-react";

export const ModeToggle = () => {
  const { enableBlockchain, toggleBlockchain } = useMode();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Wallet className="h-5 w-5" />
            <span className="hidden md:inline">
              Blockchain Settings
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-4">
          <div className="flex flex-col gap-4">            
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
                onCheckedChange={toggleBlockchain} 
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
