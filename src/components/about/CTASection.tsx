
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 px-6 bg-trustbond-primary text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Join TrustBond?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          Whether you're an individual seeking secure KYC and loans, a bank looking to streamline verification, or a developer interested in our technology, we welcome you to our platform.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild className="bg-white text-trustbond-primary hover:bg-gray-100 hover:text-trustbond-primary/90">
            <Link to="/register">
              Create an Account
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/whitepaper">
              Read Whitepaper
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
