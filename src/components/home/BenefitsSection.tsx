
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Why Choose TrustBond"
          subtitle="Our blockchain-based solution offers numerous advantages over traditional systems"
          centered={true}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-trustbond-primary">For Financial Institutions</h3>
            <ul className="space-y-4">
              {[
                "Reduced KYC processing time by up to 70%",
                "Lower compliance costs through shared verification",
                "Enhanced fraud prevention with consensus mechanisms",
                "Immutable audit trail for regulatory compliance",
                "Secure document sharing with permissioned access"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/whitepaper" className="inline-flex items-center text-trustbond-primary hover:text-trustbond-primary/80 font-semibold">
                Learn more <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-trustbond-secondary">For Customers</h3>
            <ul className="space-y-4">
              {[
                "Complete control over personal identity information",
                "One-time KYC process valid across multiple institutions",
                "Enhanced privacy with selective information sharing",
                "Digital identity that follows you across services",
                "Better loan terms based on verified trust scores"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/register" className="inline-flex items-center text-trustbond-secondary hover:text-trustbond-secondary/80 font-semibold">
                Sign up now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
