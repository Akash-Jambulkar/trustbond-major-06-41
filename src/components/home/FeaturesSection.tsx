
import { Shield, Users, Database, BarChart3 } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Built on Blockchain Technology"
          subtitle="Our platform leverages blockchain to create secure, immutable records for verification and trust scoring."
          centered={true}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <FeatureCard 
            icon={Shield}
            title="Secure KYC"
            description="One-time verification with secure sharing across trusted financial institutions."
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
          <FeatureCard 
            icon={Users}
            title="Privacy Control"
            description="Users maintain complete control over their identity information."
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
          <FeatureCard 
            icon={Database}
            title="Smart Contracts"
            description="Automated verification and consensus mechanisms through blockchain."
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
          <FeatureCard 
            icon={BarChart3}
            title="Trust Scoring"
            description="Transparent reputation system built on verified credentials."
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
