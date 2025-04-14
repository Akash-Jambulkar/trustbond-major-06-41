
import React from 'react';
import { Link } from "react-router-dom";

const WhitepaperFooter = () => {
  return (
    <footer className="bg-trustbond-dark text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold">TrustBond</Link>
            <p className="text-sm text-gray-400 mt-1">© 2025 TrustBond. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WhitepaperFooter;
