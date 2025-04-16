
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Users, Database, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-trustbond-primary/10 to-trustbond-secondary/10 z-0"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-trustbond-dark">
              Secure KYC Verification & Trust Score on Blockchain
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              TrustBond enables secure sharing of KYC information between banks while protecting user privacy and generating trusted digital identities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white">
                  Get Started
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button size="lg" variant="outline">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Built on Blockchain Technology"
            subtitle="Our platform leverages blockchain to create secure, immutable records for verification and trust scoring."
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <FeatureCard 
              icon={Shield}
              title="Secure KYC"
              description="One-time verification with secure sharing across trusted financial institutions."
            />
            <FeatureCard 
              icon={Users}
              title="Privacy Control"
              description="Users maintain complete control over their identity information."
            />
            <FeatureCard 
              icon={Database}
              title="Smart Contracts"
              description="Automated verification and consensus mechanisms through blockchain."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Trust Scoring"
              description="Transparent reputation system built on verified credentials."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="How TrustBond Works"
            subtitle="Our platform connects individuals, banks, and verification systems through blockchain technology."
            centered={true}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-trustbond-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-trustbond-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Submission</h3>
              <p className="text-gray-600">Users securely upload their KYC documents which are hashed and stored on the blockchain.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-trustbond-secondary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-trustbond-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bank Verification</h3>
              <p className="text-gray-600">Banks verify the documents and confirm authenticity, recording the verification on the blockchain.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-trustbond-accent/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-trustbond-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust Score Generation</h3>
              <p className="text-gray-600">Based on verified credentials, a trust score is generated that follows users across services.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/about">
              <Button>Learn More About Our Process</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-trustbond-primary to-trustbond-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform today and experience the security and efficiency of blockchain-based identity verification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-trustbond-primary border-white">
                Create Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white hover:bg-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
