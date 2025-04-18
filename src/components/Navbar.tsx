
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Shield, 
  Layers, 
  FileText, 
  Users, 
  HelpCircle 
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location.pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">TB</span>
            </div>
            <span className="text-xl font-bold text-trustbond-dark">TrustBond</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg ${location.pathname === '/' 
                ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                : 'text-trustbond-dark hover:bg-gray-50'} transition-colors cursor-pointer`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-lg ${location.pathname === '/about' 
                ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                : 'text-trustbond-dark hover:bg-gray-50'} transition-colors cursor-pointer`}
            >
              About
            </Link>
            
            {/* Resources dropdown for desktop */}
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-1 ${
                  location.pathname === '/whitepaper' || location.pathname === '/contact' 
                  ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                  : 'text-trustbond-dark hover:bg-gray-50'} transition-colors cursor-pointer`}
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fade-in">
                  <Link
                    to="/whitepaper"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      location.pathname === '/whitepaper' 
                      ? 'bg-trustbond-primary/5 text-trustbond-primary' 
                      : 'text-trustbond-dark hover:bg-gray-50'
                    }`}
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Whitepaper</span>
                  </Link>
                  <Link
                    to="/contact"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      location.pathname === '/contact' 
                      ? 'bg-trustbond-primary/5 text-trustbond-primary' 
                      : 'text-trustbond-dark hover:bg-gray-50'
                    }`}
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="ml-6 flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="font-medium cursor-pointer">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90 font-medium cursor-pointer">Register</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-trustbond-dark hover:text-trustbond-primary cursor-pointer p-2"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 absolute bg-white w-full left-0 shadow-lg z-50 rounded-b-xl border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-1 pt-2 pb-3 px-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-4 py-3 text-base rounded-lg ${
                  location.pathname === '/' 
                  ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                  : 'text-trustbond-dark hover:bg-gray-50'
                } cursor-pointer`}
              >
                <Layers className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/about" 
                className={`flex items-center gap-2 px-4 py-3 text-base rounded-lg ${
                  location.pathname === '/about' 
                  ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                  : 'text-trustbond-dark hover:bg-gray-50'
                } cursor-pointer`}
              >
                <Users className="h-5 w-5" />
                <span>About</span>
              </Link>
              
              {/* Resources accordion for mobile */}
              <div>
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className={`flex justify-between items-center w-full px-4 py-3 text-base rounded-lg ${
                    (location.pathname === '/whitepaper' || location.pathname === '/contact')
                    ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                    : 'text-trustbond-dark hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>Resources</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="ml-4 mt-1 space-y-1 animate-fade-in">
                    <Link 
                      to="/whitepaper" 
                      className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg ${
                        location.pathname === '/whitepaper' 
                        ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                        : 'text-trustbond-dark hover:bg-gray-50'
                      } cursor-pointer`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Whitepaper</span>
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg ${
                        location.pathname === '/contact' 
                        ? 'text-trustbond-primary font-medium bg-trustbond-primary/5' 
                        : 'text-trustbond-dark hover:bg-gray-50'
                      } cursor-pointer`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full cursor-pointer">Log in</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90 cursor-pointer">Register</Button>
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
