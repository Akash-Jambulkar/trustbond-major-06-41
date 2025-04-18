
import FeatureCard from "@/components/FeatureCard";
import { platformFeatures } from "@/constants/platformFeatures";

const PlatformFeaturesSection = () => {
  return (
    <section className="py-20 px-4" id="features-section">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-trustbond-primary bg-trustbond-primary/10 px-4 py-1 rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-trustbond-dark mb-4">
            Revolutionizing KYC and Trust Scoring
          </h2>
          <p className="text-trustbond-muted text-lg max-w-3xl mx-auto">
            Our blockchain-powered platform makes identity verification secure, efficient, and transparent for both users and financial institutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
