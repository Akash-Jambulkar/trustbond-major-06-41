
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Users, Database, BarChart3, ArrowRight, Check } from "lucide-react";

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
                <Button size="lg" className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white cursor-pointer">
                  Get Started
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button size="lg" variant="outline" className="cursor-pointer">
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
      
      {/* Benefits Section - New */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Why Choose TrustBond"
            subtitle="Our blockchain-based solution offers numerous advantages over traditional systems"
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-trustbond-primary">For Financial Institutions</h3>
              <ul className="space-y-3">
                {[
                  "Reduced KYC processing time by up to 70%",
                  "Lower compliance costs through shared verification",
                  "Enhanced fraud prevention with consensus mechanisms",
                  "Immutable audit trail for regulatory compliance",
                  "Secure document sharing with permissioned access"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/whitepaper" className="inline-flex items-center text-trustbond-primary hover:text-trustbond-primary/80 cursor-pointer">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-trustbond-secondary">For Customers</h3>
              <ul className="space-y-3">
                {[
                  "Complete control over personal identity information",
                  "One-time KYC process valid across multiple institutions",
                  "Enhanced privacy with selective information sharing",
                  "Digital identity that follows you across services",
                  "Better loan terms based on verified trust scores"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/register" className="inline-flex items-center text-trustbond-primary hover:text-trustbond-primary/80 cursor-pointer">
                  Sign up now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
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
              <Button className="cursor-pointer">Learn More About Our Process</Button>
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
              <Button size="lg" className="bg-white hover:bg-gray-100 text-trustbond-primary border-white cursor-pointer">
                Create Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white hover:bg-white/20 cursor-pointer">
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
