
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center">
                <span className="text-white font-bold">TB</span>
              </div>
              <span className="text-xl font-bold">TrustBond</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Blockchain-powered KYC verification and trust score generation for secure, efficient, and transparent financial services.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white cursor-pointer">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white cursor-pointer">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white cursor-pointer">About</Link></li>
              <li><Link to="/whitepaper" className="text-gray-400 hover:text-white cursor-pointer">Whitepaper</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white cursor-pointer">Contact</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white cursor-pointer">API Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/whitepaper" className="text-gray-400 hover:text-white cursor-pointer">Documentation</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white cursor-pointer">Developer Guide</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white cursor-pointer">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white cursor-pointer">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">info@trustbond.com</li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white cursor-pointer">Contact Form</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white cursor-pointer">Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 TrustBond. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white cursor-pointer">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white cursor-pointer">Terms of Service</Link>
            <Link to="/cookies" className="text-sm text-gray-400 hover:text-white cursor-pointer">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
