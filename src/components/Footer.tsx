
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Shield, Lock, FileText, Users, Mail, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-trustbond-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6 cursor-pointer">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">TB</span>
              </div>
              <span className="text-xl font-bold">TrustBond</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-xs">
              Blockchain-powered KYC verification and trust score generation for secure, efficient, and transparent financial services.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-trustbond-accent" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                About
              </Link></li>
              <li><Link to="/whitepaper" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                Whitepaper
              </Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                Contact
              </Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                API Documentation
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-trustbond-accent" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/whitepaper" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                Documentation
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                Developer Guide
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                Blog
              </Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-trustbond-accent rounded-full"></span>
                FAQ
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-trustbond-accent" />
              <span>Contact</span>
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-trustbond-accent" />
                info@trustbond.com
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-trustbond-accent" />
                +1 (555) 123-4567
              </li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <Lock className="h-4 w-4 text-trustbond-accent" />
                Contact Form
              </Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <Shield className="h-4 w-4 text-trustbond-accent" />
                Support
              </Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 TrustBond. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
