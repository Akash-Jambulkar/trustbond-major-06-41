
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
            <Button asChild className="bg-white text-trustbond-primary hover:bg-gray-100">
              <Link to="/whitepaper">
                Read Our Whitepaper
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">
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
