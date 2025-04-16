
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Database, 
  Lock, 
  LineChart, 
  CheckCircle, 
  ArrowRight, 
  FileCheck,
  UserCheck,
  Building
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary py-20 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <Badge variant="crypto" className="mb-4 bg-white/20 backdrop-blur-sm">TrustBond</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Secure KYC Verification & Trust Scores
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  A blockchain-powered platform that revolutionizes how financial institutions verify identities and assess risk using cutting-edge technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" size="lg" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                    <Link to="/whitepaper">Read Whitepaper</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 w-3/4 bg-white/40 rounded-full"></div>
                      <div className="h-2 bg-white/40 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-white/40 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-white/40 rounded-full"></div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-center space-x-6">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center node-animation">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center node-animation node-animation-delay-1">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center node-animation node-animation-delay-2">
                        <LineChart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">KYC Verified</p>
                        <p className="text-xs text-gray-500">Trust Score: 92/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading
              title="Key Features of TrustBond"
              subtitle="Our platform combines blockchain technology and machine learning to create a revolutionary approach to KYC verification and risk assessment."
              centered={true}
              className="mb-16"
            />
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Shield}
                title="Secure KYC Verification"
                description="Documents securely hashed and stored on the blockchain, ensuring data integrity while protecting sensitive information."
              />
              <FeatureCard 
                icon={LineChart}
                title="Trust Score Generation"
                description="Machine learning algorithms analyze customer data to create reliable trust scores for more accurate risk assessment."
              />
              <FeatureCard 
                icon={Database}
                title="Smart Contract Integration"
                description="Automated verification processes and transparent loan terms through immutable smart contracts."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <SectionHeading
              title="How TrustBond Works"
              subtitle="Our streamlined process makes KYC verification and loan applications more efficient and secure."
              centered={true}
              className="mb-16"
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Step 1 */}
                <div className="flex md:items-center flex-col md:flex-row mb-12 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10">
                    1
                  </div>
                  <div className="md:ml-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <FileCheck className="mr-2 h-5 w-5 text-trustbond-primary" />
                      Document Submission
                    </h3>
                    <p className="text-gray-600">
                      Users securely upload their KYC documents through the platform. Documents are hashed and encrypted before storage, ensuring that sensitive information remains protected.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex md:items-center flex-col md:flex-row mb-12 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10">
                    2
                  </div>
                  <div className="md:ml-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <UserCheck className="mr-2 h-5 w-5 text-trustbond-primary" />
                      Verification Process
                    </h3>
                    <p className="text-gray-600">
                      Authorized banks verify the submitted documents and record the verification status on the blockchain. This creates an immutable record of verification that can be trusted by all participants.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex md:items-center flex-col md:flex-row mb-12 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10">
                    3
                  </div>
                  <div className="md:ml-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <LineChart className="mr-2 h-5 w-5 text-trustbond-primary" />
                      Trust Score Creation
                    </h3>
                    <p className="text-gray-600">
                      Based on verified KYC data and other factors, machine learning models calculate a comprehensive trust score. This score provides a reliable measure of creditworthiness for financial institutions.
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex md:items-center flex-col md:flex-row relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10">
                    4
                  </div>
                  <div className="md:ml-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <Building className="mr-2 h-5 w-5 text-trustbond-primary" />
                      Financial Services Access
                    </h3>
                    <p className="text-gray-600">
                      With verified KYC and a trust score, users can easily apply for loans and other financial services across multiple institutions without repeating the verification process.
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line */}
                <div className="absolute top-0 bottom-0 left-6 md:left-6 w-0.5 bg-gray-200 -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading
              title="Benefits of TrustBond"
              subtitle="Our blockchain-based solution offers numerous advantages over traditional KYC and lending processes."
              centered={true}
              className="mb-16"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-trustbond-primary" />
                  Enhanced Security
                </h3>
                <p className="text-gray-600">
                  Decentralized storage and encryption protect sensitive data from breaches and unauthorized access.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-trustbond-primary" />
                  Improved Efficiency
                </h3>
                <p className="text-gray-600">
                  Automation reduces operational costs and eliminates redundant verification processes across institutions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Database className="mr-2 h-5 w-5 text-trustbond-primary" />
                  Data Integrity
                </h3>
                <p className="text-gray-600">
                  Blockchain's immutability ensures that records cannot be altered, providing a trusted source of verification.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-trustbond-primary" />
                  Better Risk Assessment
                </h3>
                <p className="text-gray-600">
                  Machine learning models provide more accurate and comprehensive risk evaluations for financial decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your KYC Process?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              Join the revolution in secure, efficient identity verification and risk assessment with TrustBond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" size="lg" asChild>
                <Link to="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                <Link to="/about">Learn More</Link>
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
