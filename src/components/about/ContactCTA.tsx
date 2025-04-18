
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform KYC Verification?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
          Whether you're a financial institution looking to streamline your KYC process or a developer interested in our technology, we'd love to hear from you.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button 
            variant="default" 
            className="bg-white text-trustbond-primary hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
            size="lg" 
            asChild
          >
            <Link to="/contact" className="px-6 py-2">Contact Us Today</Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/20 hover:scale-105 transform transition-all duration-300"
            size="lg" 
            asChild
          >
            <Link to="/whitepaper" className="px-6 py-2">Read Our Whitepaper</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
