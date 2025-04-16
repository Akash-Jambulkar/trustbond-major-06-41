
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center">
                <span className="text-white font-bold">TB</span>
              </div>
              <span className="text-xl font-bold">TrustBond</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 ${location.pathname === '/' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 ${location.pathname === '/about' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors`}
            >
              About
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="px-3 py-2 text-gray-700 hover:text-trustbond-primary transition-colors flex items-center"
                aria-expanded={isResourcesOpen}
                aria-haspopup="true"
              >
                Resources
                <ChevronDown className={`ml-1 w-4 h-4 transform transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md w-48 py-1 z-10"
                  onMouseLeave={() => setIsResourcesOpen(false)}
                >
                  <Link 
                    to="/whitepaper" 
                    className={`block px-4 py-2 ${location.pathname === '/whitepaper' ? 'text-trustbond-primary bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary`}
                  >
                    Whitepaper
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`block px-4 py-2 ${location.pathname === '/contact' ? 'text-trustbond-primary bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary`}
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/login">
              <Button variant="outline" className="ml-2">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">Register</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-500 hover:text-gray-700"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 pt-2 pb-3">
              <Link 
                to="/" 
                className={`px-4 py-2 text-base ${location.pathname === '/' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-2 text-base ${location.pathname === '/about' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md`}
              >
                About
              </Link>
              <Link 
                to="/whitepaper" 
                className={`px-4 py-2 text-base ${location.pathname === '/whitepaper' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md`}
              >
                Whitepaper
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-2 text-base ${location.pathname === '/contact' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md`}
              >
                Contact
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
