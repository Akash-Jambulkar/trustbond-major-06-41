
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Join TrustBond?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
          Whether you're an individual seeking secure KYC and loans, a bank looking to streamline verification, or a developer interested in our technology, we welcome you to our platform.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/register">
            <Button 
              className="bg-white text-trustbond-primary hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Create an Account
            </Button>
          </Link>
          <Link to="/whitepaper">
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/20 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Read Whitepaper
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
