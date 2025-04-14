
import { Link } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { AlertTriangle } from "lucide-react";

export const RegisterHeader = () => {
  const { isProductionMode } = useMode();
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-trustbond-primary font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {isProductionMode && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto py-2 px-4 flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>
              <strong>Production Mode Active:</strong> You are creating a real account
            </span>
          </div>
        </div>
      )}
    </>
  );
};
