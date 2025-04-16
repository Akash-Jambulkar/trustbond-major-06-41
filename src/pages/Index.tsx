
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
  Building,
  Sparkles
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
        {/* Hero Section - Enhanced with better visual layout */}
        <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
          </div>
          <div className="container mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <Badge variant="default" className="mb-4 bg-white/20 backdrop-blur-sm border-none text-white px-4 py-1">TrustBond</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Secure KYC Verification & Trust Scores
                </h1>
                <p className="text-xl mb-8 opacity-90 leading-relaxed">
                  A blockchain-powered platform that revolutionizes how financial institutions verify identities and assess risk using cutting-edge technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100 rounded-full" size="lg" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full" size="lg" asChild>
                    <Link to="/whitepaper">Read Whitepaper</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="h-2.5 w-3/4 bg-white/30 rounded-full"></div>
                      <div className="h-2.5 bg-white/30 rounded-full"></div>
                      <div className="h-2.5 w-2/3 bg-white/30 rounded-full"></div>
                      <div className="h-2.5 w-3/4 bg-white/30 rounded-full"></div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-around space-x-4">
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
                  
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
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
        
        {/* Features Section - Enhanced with better cards */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading
              title="Key Features of TrustBond"
              subtitle="Our platform combines blockchain technology and machine learning to create a revolutionary approach to KYC verification and risk assessment."
              centered={true}
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
        
        {/* How It Works - Enhanced with better visual style */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto">
            <SectionHeading
              title="How TrustBond Works"
              subtitle="Our streamlined process makes KYC verification and loan applications more efficient and secure."
              centered={true}
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Step 1 */}
                <div className="flex md:items-center flex-col md:flex-row mb-16 relative">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10 shadow-md">
                    1
                  </div>
                  <div className="md:ml-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 transform transition-all hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-3 flex items-center text-trustbond-primary">
                      <FileCheck className="mr-2 h-5 w-5" />
                      Document Submission
                    </h3>
                    <p className="text-gray-600">
                      Users securely upload their KYC documents through the platform. Documents are hashed and encrypted before storage, ensuring that sensitive information remains protected.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex md:items-center flex-col md:flex-row mb-16 relative">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10 shadow-md">
                    2
                  </div>
                  <div className="md:ml-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 transform transition-all hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-3 flex items-center text-trustbond-primary">
                      <UserCheck className="mr-2 h-5 w-5" />
                      Verification Process
                    </h3>
                    <p className="text-gray-600">
                      Authorized banks verify the submitted documents and record the verification status on the blockchain. This creates an immutable record of verification that can be trusted by all participants.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex md:items-center flex-col md:flex-row mb-16 relative">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10 shadow-md">
                    3
                  </div>
                  <div className="md:ml-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 transform transition-all hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-3 flex items-center text-trustbond-primary">
                      <LineChart className="mr-2 h-5 w-5" />
                      Trust Score Creation
                    </h3>
                    <p className="text-gray-600">
                      Based on verified KYC data and other factors, machine learning models calculate a comprehensive trust score. This score provides a reliable measure of creditworthiness for financial institutions.
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex md:items-center flex-col md:flex-row relative">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-trustbond-primary to-trustbond-secondary flex items-center justify-center text-white font-bold md:mr-6 mb-4 md:mb-0 z-10 shadow-md">
                    4
                  </div>
                  <div className="md:ml-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 transform transition-all hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-3 flex items-center text-trustbond-primary">
                      <Building className="mr-2 h-5 w-5" />
                      Financial Services Access
                    </h3>
                    <p className="text-gray-600">
                      With verified KYC and a trust score, users can easily apply for loans and other financial services across multiple institutions without repeating the verification process.
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line */}
                <div className="absolute top-0 bottom-0 left-7 md:left-7 w-0.5 bg-gradient-to-b from-trustbond-primary/50 to-trustbond-secondary/50 -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section - Enhanced with better cards */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading
              title="Benefits of TrustBond"
              subtitle="Our blockchain-based solution offers numerous advantages over traditional KYC and lending processes."
              centered={true}
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-trustbond-primary mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Enhanced Security
                </h3>
                <p className="text-gray-600">
                  Decentralized storage and encryption protect sensitive data from breaches and unauthorized access.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-trustbond-primary mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Improved Efficiency
                </h3>
                <p className="text-gray-600">
                  Automation reduces operational costs and eliminates redundant verification processes across institutions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-trustbond-primary mb-4">
                  <Database className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Data Integrity
                </h3>
                <p className="text-gray-600">
                  Blockchain's immutability ensures that records cannot be altered, providing a trusted source of verification.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-trustbond-primary mb-4">
                  <LineChart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Better Risk Assessment
                </h3>
                <p className="text-gray-600">
                  Machine learning models provide more accurate and comprehensive risk evaluations for financial decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Enhanced with better visual style */}
        <section className="py-24 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 mr-2" />
              <span className="text-sm font-semibold uppercase tracking-wider">Ready to Transform Your KYC Process?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the revolution in secure identity verification</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              Experience the future of KYC verification and risk assessment with TrustBond's blockchain-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100 rounded-full" size="lg" asChild>
                <Link to="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full" size="lg" asChild>
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
