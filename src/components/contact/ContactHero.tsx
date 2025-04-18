
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactHero = () => {
  return (
    <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Contact Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 animate-fade-in">
          Have questions about TrustBond? We'd love to hear from you. Reach out to our team using the contact information below or fill out the form.
        </p>
        <div className="flex justify-center gap-6 flex-wrap animate-fade-in">
          <Link to="/about">
            <Button 
              className="bg-white text-trustbond-primary hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Learn More About Us
            </Button>
          </Link>
          <Link to="/register">
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/20 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold px-8 py-3"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
