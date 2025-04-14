
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const OurMission = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-trustbond-dark mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              TrustBond was founded with a clear mission: to revolutionize how identity verification and loan processes work in the digital age. We believe that these essential financial services should be:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                  <ArrowRight size={16} className="text-trustbond-primary" />
                </div>
                <p className="text-gray-700"><strong className="text-trustbond-dark">Secure:</strong> Protecting user data and privacy above all else.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                  <ArrowRight size={16} className="text-trustbond-primary" />
                </div>
                <p className="text-gray-700"><strong className="text-trustbond-dark">Efficient:</strong> Eliminating redundant processes and unnecessary waiting periods.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                  <ArrowRight size={16} className="text-trustbond-primary" />
                </div>
                <p className="text-gray-700"><strong className="text-trustbond-dark">Transparent:</strong> Providing clear visibility into all processes and decisions.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                  <ArrowRight size={16} className="text-trustbond-primary" />
                </div>
                <p className="text-gray-700"><strong className="text-trustbond-dark">Inclusive:</strong> Making financial services accessible to more people.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                  <ArrowRight size={16} className="text-trustbond-primary" />
                </div>
                <p className="text-gray-700"><strong className="text-trustbond-dark">User-controlled:</strong> Giving individuals control over their data and financial identity.</p>
              </li>
            </ul>
            <div className="mt-8">
              <Button asChild className="bg-trustbond-primary hover:bg-trustbond-primary/90">
                <Link to="/register">
                  Join Our Platform <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-trustbond-primary to-trustbond-secondary rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="mb-6 leading-relaxed">
              We envision a future where identity verification is done once, securely stored on the blockchain, and reusable across financial services. Where trust scores provide an objective measure of creditworthiness that follows individuals throughout their financial journey. Where loans are transparent, fair, and accessible to all.
            </p>
            <p className="font-medium">
              TrustBond is building the infrastructure for this future, one block at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
