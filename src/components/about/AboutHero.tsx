
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutHero = () => {
  return (
    <section className="bg-trustbond-primary text-white py-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About TrustBond</h1>
          <p className="text-xl leading-relaxed mb-8">
            Transforming KYC verification and loan processes through blockchain technology to create a more secure, efficient, and inclusive financial ecosystem.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              className="bg-white text-trustbond-primary hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <Link to="/whitepaper" className="w-full px-6 py-2 block">
                Read Our Whitepaper
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/20 hover:scale-105 transform transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <Link to="/contact" className="w-full px-6 py-2 block">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
