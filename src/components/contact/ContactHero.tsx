
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactHero = () => {
  return (
    <section className="bg-trustbond-primary text-white py-16 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Have questions about TrustBond? We'd love to hear from you. Reach out to our team using the contact information below or fill out the form.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            className="bg-white text-trustbond-primary hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
            asChild
          >
            <Link to="/whitepaper" className="px-6 py-2">
              Learn More in Whitepaper
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/20 hover:scale-105 transform transition-all duration-300"
            asChild
          >
            <Link to="/register" className="px-6 py-2">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
