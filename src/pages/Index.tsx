
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Shield, Lock, TrendingUp, Database, Users, Activity } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
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
            <FeatureCard 
              icon={Shield}
              title="Secure KYC Verification"
              description="Submit your KYC documents once and have them securely verified using blockchain technology, ensuring data privacy."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Trust Score Generation"
              description="Get a portable trust score based on your verified credentials, improving your access to financial services."
            />
            <FeatureCard 
              icon={Database}
              title="Smart Contract Integration"
              description="Transparent loan terms and automatic execution through smart contracts for faster processing and reduced fraud."
            />
            <FeatureCard 
              icon={Users}
              title="Cross-Bank Collaboration"
              description="Verified credentials can be securely shared across financial institutions, eliminating redundant verifications."
            />
            <FeatureCard 
              icon={Lock}
              title="Enhanced Data Security"
              description="Your documents are securely hashed and only the verification status is stored on the blockchain."
            />
            <FeatureCard 
              icon={Activity}
              title="Real-Time Risk Assessment"
              description="Advanced algorithms provide real-time risk assessment for better loan decisions and interest rates."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* CTA Section */}
      <CTASection />
      
      <Footer />
    </div>
  );
};

export default Index;
