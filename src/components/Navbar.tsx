
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
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
              className={`px-3 py-2 ${location.pathname === '/' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors cursor-pointer`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 ${location.pathname === '/about' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors cursor-pointer`}
            >
              About
            </Link>
            
            {/* Resources dropdown for desktop */}
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`px-3 py-2 flex items-center space-x-1 ${location.pathname === '/whitepaper' || location.pathname === '/contact' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors cursor-pointer`}
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/whitepaper"
                    className={`block px-4 py-2 text-sm ${location.pathname === '/whitepaper' ? 'bg-gray-100 text-trustbond-primary' : 'text-gray-700'} hover:bg-gray-100`}
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    Whitepaper
                  </Link>
                  <Link
                    to="/contact"
                    className={`block px-4 py-2 text-sm ${location.pathname === '/contact' ? 'bg-gray-100 text-trustbond-primary' : 'text-gray-700'} hover:bg-gray-100`}
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/login">
              <Button variant="outline" className="ml-2 cursor-pointer">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="default" className="cursor-pointer">Register</Button>
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 absolute bg-white w-full left-0 shadow-md z-50">
            <div className="flex flex-col space-y-2 pt-2 pb-3 px-4">
              <Link 
                to="/" 
                className={`px-4 py-2 text-base ${location.pathname === '/' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-2 text-base ${location.pathname === '/about' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
              >
                About
              </Link>
              
              {/* Resources accordion for mobile */}
              <div>
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex justify-between items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer"
                >
                  <span>Resources</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link 
                      to="/whitepaper" 
                      className={`block px-4 py-2 text-sm ${location.pathname === '/whitepaper' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
                    >
                      Whitepaper
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`block px-4 py-2 text-sm ${location.pathname === '/contact' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full cursor-pointer">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="w-full cursor-pointer">Register</Button>
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
