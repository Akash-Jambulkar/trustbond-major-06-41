
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-trustbond-primary/5 via-trustbond-secondary/5 to-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary bg-clip-text text-transparent">
            Secure KYC Verification & Trust Score on Blockchain
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed">
            TrustBond enables secure sharing of KYC information between banks while protecting user privacy and generating trusted digital identities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary hover:opacity-90 hover:scale-105 transform transition-all duration-300 text-white font-semibold px-8 py-6 text-lg h-auto w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <Link to="/register" className="w-full block">
                Get Started
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-trustbond-primary px-8 py-6 text-lg h-auto hover:bg-trustbond-primary/10 hover:scale-105 transform transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <Link to="/whitepaper" className="w-full block">
                Read Whitepaper
              </Link>
            </Button>
          </div>
          <div className="mt-12 animate-bounce">
            <ChevronDown className="mx-auto h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
