
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-trustbond-primary/5 via-trustbond-secondary/5 to-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary bg-clip-text text-transparent animate-fade-in">
            Secure KYC Verification & Trust Score on Blockchain
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed animate-fade-in opacity-90">
            TrustBond enables secure sharing of KYC information between banks while protecting user privacy and generating trusted digital identities.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary hover:opacity-90 transform transition-all duration-300 hover:scale-105 text-white font-semibold px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Get Started Now
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-trustbond-primary px-8 py-6 text-lg h-auto hover:bg-trustbond-primary/10 transform transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
          <div className="mt-16 animate-bounce cursor-pointer" onClick={scrollToFeatures}>
            <ChevronDown className="mx-auto h-8 w-8 text-trustbond-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
