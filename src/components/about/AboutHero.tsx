
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutHero = () => {
  return (
    <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in">About TrustBond</h1>
          <p className="text-xl leading-relaxed mb-12 opacity-90 animate-fade-in">
            Transforming KYC verification and loan processes through blockchain technology to create a more secure, efficient, and inclusive financial ecosystem.
          </p>
          <div className="flex justify-center gap-6 flex-wrap animate-fade-in">
            <Link to="/whitepaper">
              <Button 
                className="bg-white text-trustbond-primary hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3 w-full sm:w-auto"
              >
                Read Our Whitepaper
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/20 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3 w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
