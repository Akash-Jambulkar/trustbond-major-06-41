
import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-trustbond-dark text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TrustBond</h3>
            <p className="text-white/70">
              Blockchain-powered identity verification and financial services platform.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/whitepaper" className="text-white/70 hover:text-white transition-colors">Whitepaper</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-white/70 mb-2">infoTrustbond@trustbond.com</p>
            <p className="text-white/70">+91 9854742954</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} TrustBond. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
