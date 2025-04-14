
import { Link } from "react-router-dom";

export const RegisterHeader = () => {
  return (
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
  );
};
