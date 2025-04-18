
import { Shield, BarChart2, Database, UserCheck, Lock, LineChart } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";

const Features = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <SectionHeading 
          title="Key Features" 
          subtitle="TrustBond combines blockchain technology with machine learning to create a revolutionary KYC verification and trust score platform."
          centered={true}
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Shield}
            title="Secure KYC Verification"
            description="Documents are securely hashed and stored on the blockchain, ensuring data integrity while protecting sensitive information."
          />
          <FeatureCard 
            icon={BarChart2}
            title="Trust Score Generation"
            description="Machine learning algorithms analyze customer data to create reliable trust scores for more accurate risk assessment."
          />
          <FeatureCard 
            icon={Database}
            title="Smart Contract Integration"
            description="Automated verification processes and transparent loan terms through immutable smart contracts."
          />
          <FeatureCard 
            icon={UserCheck}
            title="Cross-Bank Collaboration"
            description="Secure sharing of verified KYC data across financial institutions, reducing redundancy and improving efficiency."
          />
          <FeatureCard 
            icon={Lock}
            title="Enhanced Data Security"
            description="Multi-factor authentication and encryption ensure that sensitive data is protected from unauthorized access."
          />
          <FeatureCard 
            icon={LineChart}
            title="Real-Time Risk Assessment"
            description="Dynamic monitoring and assessment of financial risk for better decision-making in loan applications."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
