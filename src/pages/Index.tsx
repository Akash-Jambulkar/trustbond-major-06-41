
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Users, Database, BarChart3, ArrowRight, Check, ChevronDown } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section with enhanced styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-trustbond-primary/5 via-trustbond-secondary/5 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary bg-clip-text text-transparent">
              Secure KYC Verification & Trust Score on Blockchain
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed">
              TrustBond enables secure sharing of KYC information between banks while protecting user privacy and generating trusted digital identities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg h-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button size="lg" variant="outline" className="border-2 px-8 py-6 text-lg h-auto hover:bg-gray-50">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
            <div className="mt-12 animate-bounce">
              <ChevronDown className="mx-auto h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with enhanced cards */}
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
      
      {/* Benefits Section with enhanced styling */}
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
      
      {/* How It Works Section with enhanced styling */}
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
      
      {/* CTA Section with enhanced styling */}
      <section className="py-24 bg-gradient-to-br from-trustbond-primary to-trustbond-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            Join our platform today and experience the security and efficiency of blockchain-based identity verification.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-gray-50 text-trustbond-primary font-semibold border-white px-8 py-6 text-lg h-auto">
                Create Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white/20 text-white font-semibold px-8 py-6 text-lg h-auto">
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
