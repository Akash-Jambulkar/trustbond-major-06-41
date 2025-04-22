
import React from "react";
import { Button } from "@/components/ui/button";

interface RegisterSubmitButtonProps {
  isLoading: boolean;
}

export const RegisterSubmitButton = ({ isLoading }: RegisterSubmitButtonProps) => {
  return (
    <div className="pt-2">
      <Button 
        type="submit" 
        className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
    </div>
  );
};
