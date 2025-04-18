
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Database, UserCheck, BarChart2, LockKeyhole, LineChart } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import SectionHeading from '@/components/SectionHeading';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Revolutionize KYC & Trust Scoring with Blockchain
              </h1>
              <p className="text-xl mb-8">
                A secure, efficient, and transparent platform for KYC verification, trust score generation, and lending services powered by blockchain technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-trustbond-primary hover:bg-gray-100">
                  <Link to="/register">
                    Get Started
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/whitepaper">
                    Read Whitepaper
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <SectionHeading 
              title="Key Features" 
              subtitle="TrustBond combines blockchain technology with machine learning to create a revolutionary KYC verification and trust score platform."
              centered={true}
            />
            
            <div className="grid md:grid-cols-3 gap-8">
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
                icon={LockKeyhole}
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
        
        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading 
              title="How It Works" 
              subtitle="Our platform connects individuals, banks, and blockchain technology to create a seamless verification and lending ecosystem."
              centered={true}
            />
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-trustbond-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-trustbond-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Document Submission</h3>
                <p className="text-gray-600">
                  Users securely upload their KYC documents. The documents are hashed and encrypted before storage.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-trustbond-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-trustbond-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. Verification by Banks</h3>
                <p className="text-gray-600">
                  Authorized banks verify the submitted documents and record the verification status on the blockchain.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-trustbond-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="h-8 w-8 text-trustbond-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Trust Score Generation</h3>
                <p className="text-gray-600">
                  Based on verified data, algorithms calculate a trust score that serves as a measure of creditworthiness.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-trustbond-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your KYC Process?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join TrustBond today and experience secure, efficient, and transparent KYC verification powered by blockchain technology.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="bg-white text-trustbond-primary hover:bg-gray-100">
                <Link to="/register">
                  Create an Account
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
