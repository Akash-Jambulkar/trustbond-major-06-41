
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const AboutHero = () => {
  return (
    <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="default" className="mb-4 bg-white/20 backdrop-blur-sm">About TrustBond</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Revolutionizing KYC Verification with Blockchain
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A secure, efficient, and transparent system that transforms how financial institutions verify identities and assess risk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" asChild>
              <Link to="/whitepaper">Read Whitepaper</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
