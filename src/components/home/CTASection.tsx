
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-trustbond-primary to-trustbond-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
          Join our platform today and experience the security and efficiency of blockchain-based identity verification.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/register">
            <Button size="lg" className="bg-white hover:bg-gray-50 text-trustbond-primary font-semibold border-white px-8 py-6 text-lg h-auto">
              Create Account
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white/20 text-white font-semibold px-8 py-6 text-lg h-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
