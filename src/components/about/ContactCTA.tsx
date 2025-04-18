
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform KYC Verification?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
          Whether you're a financial institution looking to streamline your KYC process or a developer interested in our technology, we'd love to hear from you.
        </p>
        <div className="flex justify-center flex-wrap gap-6">
          <Link to="/contact">
            <Button 
              className="bg-white text-trustbond-primary hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Contact Us Today
            </Button>
          </Link>
          <Link to="/whitepaper">
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/20 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Read Our Whitepaper
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
