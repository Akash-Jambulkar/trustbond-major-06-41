
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
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
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={`${location.pathname === '/whitepaper' || location.pathname === '/contact' ? 'text-trustbond-primary font-medium' : 'text-gray-700'} hover:text-trustbond-primary transition-colors cursor-pointer`}
                  >
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/whitepaper"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === '/whitepaper' ? "bg-accent text-accent-foreground" : "text-gray-700"
                            )}
                          >
                            <div className="text-sm font-medium">Whitepaper</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Read our technical paper
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/contact"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === '/contact' ? "bg-accent text-accent-foreground" : "text-gray-700"
                            )}
                          >
                            <div className="text-sm font-medium">Contact</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Get in touch with our team
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/login">
              <Button variant="outline" className="ml-2 cursor-pointer">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="default" className="cursor-pointer">Register</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
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
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 pt-2 pb-3">
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
              <Link 
                to="/whitepaper" 
                className={`px-4 py-2 text-base ${location.pathname === '/whitepaper' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
              >
                Whitepaper
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-2 text-base ${location.pathname === '/contact' ? 'text-trustbond-primary font-medium bg-gray-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-trustbond-primary rounded-md cursor-pointer`}
              >
                Contact
              </Link>
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
