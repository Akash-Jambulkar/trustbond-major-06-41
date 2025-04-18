
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="How TrustBond Works"
          subtitle="Our platform connects individuals, banks, and verification systems through blockchain technology."
          centered={true}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-trustbond-primary/10 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-trustbond-primary">1</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Document Submission</h3>
            <p className="text-gray-600 leading-relaxed">Users securely upload their KYC documents which are hashed and stored on the blockchain.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-trustbond-secondary/10 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-trustbond-secondary">2</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Bank Verification</h3>
            <p className="text-gray-600 leading-relaxed">Banks verify the documents and confirm authenticity, recording the verification on the blockchain.</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-trustbond-accent/10 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-trustbond-accent">3</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Trust Score Generation</h3>
            <p className="text-gray-600 leading-relaxed">Based on verified credentials, a trust score is generated that follows users across services.</p>
          </div>
        </div>
        
        <div className="flex justify-center mt-16">
          <Link to="/about">
            <Button size="lg" className="bg-gradient-to-r from-trustbond-primary/90 to-trustbond-secondary/90 hover:from-trustbond-primary hover:to-trustbond-secondary text-white px-8">
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
