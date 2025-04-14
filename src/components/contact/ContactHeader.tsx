
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-trustbond-primary">
          TrustBond
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
            About
          </Link>
          <Link to="/whitepaper" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
            Whitepaper
          </Link>
          <Link to="/login" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
            Login
          </Link>
          <Link to="/register" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
            Register
          </Link>
        </nav>
        <div className="md:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Menu</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ContactHeader;
