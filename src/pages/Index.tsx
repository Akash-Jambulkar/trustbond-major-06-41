
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Shield, Lock, TrendingUp, Database, FileText, Layers, Users, Activity, ChevronRight, CheckCircle, Award, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Secure KYC Verification Powered by Blockchain
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                TrustBond connects banks and users through a decentralized platform for secure identity verification, trust scoring, and loan processing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-white text-trustbond-primary hover:bg-gray-100 font-medium text-base px-6 py-3 h-auto">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-base px-6 py-3 h-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold">100%</h3>
                  <p className="text-white/80 text-sm">Secure Verification</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold">50+</h3>
                  <p className="text-white/80 text-sm">Banking Partners</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold">10K+</h3>
                  <p className="text-white/80 text-sm">Verified Users</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6 animate-fade-in shadow-xl border border-white/20 hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-4">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-trustbond-accent mr-2" />
                  <h3 className="font-semibold">KYC Verification</h3>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-trustbond-accent w-4/5 rounded-full"></div>
                </div>
                <p className="text-right text-sm mt-1">80% Complete</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-green-400 mr-2" />
                    <h3 className="font-semibold">Trust Score</h3>
                  </div>
                  <span className="text-lg font-bold">85/100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Good</span>
                  <span className="text-green-400">↑ +5 points this month</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <Layers className="h-5 w-5 text-blue-300 mr-2" />
                  <h3 className="font-semibold">Blockchain Transactions</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Recent KYC Verification</span>
                  <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full">Confirmed</span>
                </div>
                <div className="text-xs truncate font-mono bg-white/5 p-2 rounded border border-white/10">
                  0x3a8d...7e91
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-trustbond-muted">Trusted By Leading Financial Institutions</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="w-32 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">Bank One</span>
            </div>
            <div className="w-32 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">FinTrust</span>
            </div>
            <div className="w-32 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">NexBank</span>
            </div>
            <div className="w-32 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">DigiCred</span>
            </div>
            <div className="w-32 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">SecureID</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-trustbond-secondary bg-trustbond-secondary/10 px-4 py-1 rounded-full mb-4">
              Platform Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-trustbond-dark mb-4">
              How TrustBond Works
            </h2>
            <p className="text-trustbond-muted text-lg max-w-3xl mx-auto">
              A simple, secure, and transparent process for KYC verification and loan applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-trustbond-primary text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div className="bg-trustbond-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-trustbond-dark">Document Submission</h3>
              <p className="text-trustbond-muted">
                Upload your identity documents through the secure platform. Your documents are hashed and encrypted.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-trustbond-primary text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div className="bg-trustbond-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-trustbond-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-trustbond-dark">Bank Verification</h3>
              <p className="text-trustbond-muted">
                Authorized banks verify your documents and record the verification status on the blockchain.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-trustbond-primary text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div className="bg-trustbond-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-trustbond-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-trustbond-dark">Trust Score Generation</h3>
              <p className="text-trustbond-muted">
                Based on your verified information, a trust score is calculated to represent your creditworthiness.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-trustbond-primary text-white flex items-center justify-center font-semibold">
                4
              </div>
              <div className="bg-trustbond-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-trustbond-dark">Loan Processing</h3>
              <p className="text-trustbond-muted">
                Apply for loans using your trust score. Smart contracts ensure transparent terms and automated execution.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-trustbond-primary bg-trustbond-primary/10 px-4 py-1 rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-trustbond-dark mb-4">
              What Our Users Say
            </h2>
            <p className="text-trustbond-muted text-lg max-w-3xl mx-auto">
              Hear from users and banking partners who have transformed their verification and loan processes with TrustBond.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-trustbond-muted mb-6">
                "TrustBond simplified my loan application process. I only had to submit my KYC documents once, and now I can apply for loans across multiple banks with just a few clicks."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-trustbond-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-trustbond-primary font-semibold">RK</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-trustbond-dark">Rahul Kumar</h4>
                  <p className="text-sm text-trustbond-muted">Business Owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-trustbond-muted mb-6">
                "As a community bank, TrustBond has revolutionized our KYC process. We've reduced verification time by 80% while improving security and compliance with regulatory requirements."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-trustbond-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-trustbond-secondary font-semibold">SM</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-trustbond-dark">Sarah Mehra</h4>
                  <p className="text-sm text-trustbond-muted">Bank Operations Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-trustbond-muted mb-6">
                "The trust score feature has helped me improve my credit profile over time. I started with a small loan and gradually built up my score, giving me access to better interest rates."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-trustbond-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-trustbond-accent font-semibold">AP</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-trustbond-dark">Ananya Patel</h4>
                  <p className="text-sm text-trustbond-muted">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Secure KYC Verification?</h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of users and financial institutions who are already benefiting from our blockchain-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-trustbond-primary hover:bg-gray-100 font-medium text-base px-8 py-3 h-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-medium text-base px-8 py-3 h-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-white/80">Advanced encryption and blockchain security</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Easy to Use</h3>
                <p className="text-sm text-white/80">Intuitive interface for all users</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Regulatory Compliant</h3>
                <p className="text-sm text-white/80">Meets all regulatory requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
